export function formatResponse(
  primary,
  allContacts = [],
  newSecondaryId = null
) {
  const emails = new Set();
  const phoneNumbers = new Set();
  const secondaryIds = [];

  if (primary.email) emails.add(primary.email);
  if (primary.phoneNumber) phoneNumbers.add(primary.phoneNumber);

  allContacts.forEach((contact) => {
    if (contact.email) emails.add(contact.email);
    if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
    if (contact.linkPrecedence === "secondary") {
      secondaryIds.push(contact._id.toString());
    }
  });

  if (newSecondaryId && !secondaryIds.includes(newSecondaryId.toString())) {
    secondaryIds.push(newSecondaryId.toString());
  }

  return {
    primaryContactId: primary._id.toString(),
    emails: Array.from(emails).sort(),
    phoneNumbers: Array.from(phoneNumbers).sort(),
    secondaryContactIds: secondaryIds.sort((a, b) => a.localeCompare(b)),
  };
}
