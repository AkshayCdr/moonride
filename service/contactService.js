import Contact from "../model/contact.js";

export async function identifyContact(email, phoneNumber) {
  // Normalize email
  const normalizedEmail = email?.toLowerCase();

  // Find existing contacts
  const existingContacts = await Contact.find({
    $or: [
      { email: normalizedEmail, deletedAt: null },
      { phoneNumber, deletedAt: null },
    ],
  });

  // Case 1: No existing contacts - create new primary
  if (existingContacts.length === 0) {
    const newContact = await Contact.create({
      email: normalizedEmail,
      phoneNumber,
      linkPrecedence: "primary",
    });
    return { primary: newContact, allContacts: [], newSecondaryId: null };
  }

  // Determine primary contacts
  const primaryContacts = await Promise.all(
    existingContacts.map(async (contact) => {
      let current = contact;
      while (current.linkPrecedence === "secondary") {
        current = await Contact.findById(current.linkedId);
      }
      return current;
    })
  );

  // Get unique primaries sorted by creation time
  const uniquePrimaries = Array.from(
    new Map(primaryContacts.map((p) => [p._id.toString(), p])).values()
  ).sort((a, b) => a.createdAt - b.createdAt);

  const oldestPrimary = uniquePrimaries[0];

  // If there are multiple primaries, merge them by updating to secondary
  if (uniquePrimaries.length > 1) {
    await Promise.all(
      uniquePrimaries.slice(1).map(async (primary) => {
        await Contact.findByIdAndUpdate(primary._id, {
          linkPrecedence: "secondary",
          linkedId: oldestPrimary._id,
          updatedAt: new Date(),
        });
        await Contact.updateMany(
          { linkedId: primary._id },
          { $set: { linkedId: oldestPrimary._id } }
        );
      })
    );
  }

  // Create new secondary contact if needed
  const newSecondary = await Contact.create({
    email: normalizedEmail,
    phoneNumber,
    linkedId: oldestPrimary._id,
    linkPrecedence: "secondary",
  });

  // Get all linked contacts
  const allContacts = await Contact.find({
    $or: [{ _id: oldestPrimary._id }, { linkedId: oldestPrimary._id }],
    deletedAt: null,
  });

  return {
    primary: oldestPrimary,
    allContacts,
    newSecondaryId: newSecondary._id,
  };
}
