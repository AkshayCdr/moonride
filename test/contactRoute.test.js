import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
} from "vitest";
import app from "../main.js";
import Contact from "../model/contact.js";
import mongoose from "mongoose";
import request from "supertest";

describe("Contact API Tests", () => {
  beforeAll(() => {
    vi.spyOn(mongoose, "connect").mockResolvedValue();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /identify", () => {
    test("should create primary contact when no existing contacts", async () => {
      const mockContact = {
        _id: "661d2a9b8f4e4d85d3c8b4567",
        email: "test@example.com",
        phoneNumber: "1234567890",
        linkPrecedence: "primary",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.spyOn(Contact, "find").mockResolvedValue([]);
      vi.spyOn(Contact, "create").mockResolvedValue(mockContact);

      const res = await request(app)
        .post("/identify")
        .send({ email: "test@example.com", phoneNumber: "1234567890" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        primaryContactId: "661d2a9b8f4e4d85d3c8b4567",
        emails: ["test@example.com"],
        phoneNumbers: ["1234567890"],
        secondaryContactIds: [],
      });
    });

    test("should create secondary contact when primary exists", async () => {
      const primaryContact = {
        _id: "661d2a9b8f4e4d85d3c8b4567",
        email: "existing@example.com",
        phoneNumber: "1111111111",
        linkPrecedence: "primary",
        createdAt: new Date(),
      };

      const secondaryContact = {
        _id: "661d2a9b8f4e4d85d3c8b4568",
        email: "test@example.com",
        phoneNumber: "1234567890",
        linkedId: primaryContact._id,
        linkPrecedence: "secondary",
        createdAt: new Date(),
      };

      vi.spyOn(Contact, "find").mockResolvedValue([primaryContact]);
      vi.spyOn(Contact, "create").mockResolvedValue(secondaryContact);

      const res = await request(app)
        .post("/identify")
        .send({ email: "test@example.com", phoneNumber: "1234567890" });

      expect(res.status).toBe(200);
      expect(res.body.primaryContactId).toBe(primaryContact._id);
      expect(res.body.emails).toContain("existing@example.com");
      expect(res.body.emails).toContain("test@example.com");
      expect(res.body.secondaryContactIds).toContain(secondaryContact._id);
    });
  });

  describe("CRUD Operations", () => {
    test("GET /contacts should return all contacts", async () => {
      const mockContacts = [
        {
          _id: "661d2a9b8f4e4d85d3c8b4567",
          email: "test@example.com",
          phoneNumber: "1234567890",
          linkPrecedence: "primary",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.spyOn(Contact, "find").mockResolvedValue(mockContacts);

      const res = await request(app).get("/contacts");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          id: mockContacts[0]._id,
          email: mockContacts[0].email,
          phoneNumber: mockContacts[0].phoneNumber,
          linkedId: null,
          linkPrecedence: "primary",
          createdAt: mockContacts[0].createdAt.toISOString(),
          updatedAt: mockContacts[0].updatedAt.toISOString(),
          deletedAt: null,
        },
      ]);
    });

    test("DELETE /contacts/:id should soft delete contact", async () => {
      const contactId = "661d2a9b8f4e4d85d3c8b4567";
      const deletedContact = {
        _id: contactId,
        deletedAt: new Date(),
      };

      vi.spyOn(Contact, "findByIdAndUpdate").mockResolvedValue(deletedContact);

      const res = await request(app).delete(`/contacts/${contactId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Contact soft-deleted successfully"
      );
      expect(Contact.findByIdAndUpdate).toHaveBeenCalledWith(
        contactId,
        { deletedAt: expect.any(Date) },
        { new: true }
      );
    });
  });
});
