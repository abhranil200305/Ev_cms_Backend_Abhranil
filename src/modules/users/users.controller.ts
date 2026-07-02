import { Request, Response, NextFunction } from "express";
import { UsersService } from "./users.service";

const usersService = new UsersService();

export class UsersController {
  // 1. GET /api/v1/users/me
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized token context." });
        return;
      }
      const userUid = req.user.userUid;
      const profile = await usersService.getUserProfile(userUid);
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  // 2. POST /api/v1/users/profile
  async createProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized token context." });
        return;
      }
      
      const localReq = req as any;
      const userUid = localReq.user.userUid;
      
      // Look for an image asset file across any field variations
      const file = localReq.files?.find(
        (f: any) => f.fieldname === "image" || f.fieldname === "profileImageUrl" || f.fieldname === "profile_image_url"
      );
      
      let relativeImageUrl: string | null = null;
      if (file) {
        // 🚀 FIXED: Captures strictly a relative path string location
        relativeImageUrl = `/uploads/${file.filename}`;
      } else {
        relativeImageUrl = localReq.body.profileImageUrl || localReq.body.profile_image_url || null;
      }

      // Explicit field data mapping parameters setup (adminUid completely removed)
      const mappedBody = {
        username: localReq.body.username,
        firstName: localReq.body.firstName || localReq.body.first_name,
        lastName: localReq.body.lastName || localReq.body.last_name,
        designation: localReq.body.designation,
        address: localReq.body.address,
        phone: localReq.body.phone,
      };

      const completedUser = await usersService.saveProfileData(userUid, mappedBody, relativeImageUrl);
      res.status(201).json({ success: true, message: "Profile initial setup completed successfully.", data: completedUser });
    } catch (error) {
      next(error);
    }
  }

  // 3. PATCH /api/v1/users/profile
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized token context." });
        return;
      }

      const localReq = req as any;
      const userUid = localReq.user.userUid;

      const file = localReq.files?.find(
        (f: any) => f.fieldname === "image" || f.fieldname === "profileImageUrl" || f.fieldname === "profile_image_url"
      );

      let updatedRelativeUrl: string | undefined = undefined;
      if (file) {
        // 🚀 FIXED: Captures strictly a relative path string location
        updatedRelativeUrl = `/uploads/${file.filename}`;
      } else if (localReq.body.profileImageUrl !== undefined || localReq.body.profile_image_url !== undefined) {
        updatedRelativeUrl = localReq.body.profileImageUrl || localReq.body.profile_image_url;
      }

      const mappedBody = {
        username: localReq.body.username,
        firstName: localReq.body.firstName || localReq.body.first_name,
        lastName: localReq.body.lastName || localReq.body.last_name,
        designation: localReq.body.designation,
        address: localReq.body.address,
        phone: localReq.body.phone,
      };

      const updatedUser = await usersService.updateProfileData(userUid, mappedBody, updatedRelativeUrl);
      res.status(200).json({ success: true, message: "Profile synchronized successfully.", data: updatedUser });
    } catch (error) {
      next(error);
    }
  }
}