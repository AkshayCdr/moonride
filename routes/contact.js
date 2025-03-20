import express from "express";
import Contact from "../model/contact.js";
import { identifyContact } from "../service/contactService.js";

const router = express.Router();

router.post("/identify", async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({ error: "Either email or phone number must be provided" });
    }

    const { primary, allContacts, newSecondaryId } = await identifyContact(
      email,
      phoneNumber
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts.map(formatContact));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });
    res.json(formatContact(contact));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/contacts/:id", async (req, res) => {
  try {
    const updates = req.body;
    if (updates.email) updates.email = updates.email.toLowerCase();

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedContact)
      return res.status(404).json({ error: "Contact not found" });
    res.json(formatContact(updatedContact));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!contact) return res.status(404).json({ error: "Contact not found" });
    res.json({ message: "Contact soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function formatContact(contact) {
  return {
    id: contact._id,
    phoneNumber: contact.phoneNumber,
    email: contact.email,
    linkedId: contact.linkedId,
    linkPrecedence: contact.linkPrecedence,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
    deletedAt: contact.deletedAt,
  };
}

export default router;
