


import { Request, Response } from "express";
import { 
  createContactService, 
  getContactsService, 
  updateContactService,
  deleteContactService,
  getContactByIdService 
} from "../services/contactService";

// 🔹 User can create contact
export const createContact = async (req: Request, res: Response) => {
  try {
    console.log("🔍 Request user object:", (req as any).user); // Debug log
    console.log("🔍 Request body:", req.body); // Debug log
    
    const userId = (req as any).user?.userId;
    
    // Validate userId exists
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing. Please login again."
      });
    }
    
    // Prepare contact data
    const contactData = {
      name: req.body.name,
      email: req.body.email,
      place: req.body.place,
      dob: req.body.dob,
      userId: userId // Ensure this is set
    };
    
    console.log("📝 Creating contact with data:", contactData); // Debug log
    
    const contact = await createContactService(contactData);
    
    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      contact
    });
  } catch (error: any) {
    console.error("❌ Create contact error:", error); // Detailed error log
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to create contact" 
    });
  }
};

// 🔹 Admin can get all contacts with pagination
export const getContacts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const search = req.query.search as string;
    
    const result = await getContactsService(page, limit, search);
    
    res.json({
      success: true,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: page,
      contacts: result.contacts
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to fetch contacts" 
    });
  }
};

// 🔹 User can get own contacts
export const getUserContacts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing"
      });
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    
    const result = await getContactsService(page, limit, '', userId);
    
    // Cache for 30 seconds (client-side)
    res.set('Cache-Control', 'private, max-age=30');
    
    res.json({
      success: true,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: page,
      contacts: result.contacts
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to fetch contacts" 
    });
  }
};

// 🔹 Admin can update any contact
export const updateContact = async (req: Request, res: Response) => {
  try {
    const contactId = parseInt(req.params.id, 10);
    const updatedContact = await updateContactService(contactId, req.body);
    
    res.json({
      success: true,
      message: "Contact updated successfully",
      contact: updatedContact
    });
  } catch (error: any) {
    if (error.message === "Contact not found") {
      return res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: "Failed to update contact" 
    });
  }
};

// 🔹 Admin can delete contact
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const contactId = parseInt(req.params.id, 10);
    await deleteContactService(contactId);
    
    res.json({
      success: true,
      message: "Contact deleted successfully"
    });
  } catch (error: any) {
    if (error.message === "Contact not found") {
      return res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete contact" 
    });
  }
};

// 🔹 Get single contact by ID (Admin only)
export const getContactById = async (req: Request, res: Response) => {
  try {
    const contactId = parseInt(req.params.id, 10);
    const contact = await getContactByIdService(contactId);
    
    res.json({
      success: true,
      contact
    });
  } catch (error: any) {
    if (error.message === "Contact not found") {
      return res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch contact" 
    });
  }
};