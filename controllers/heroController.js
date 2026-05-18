import Hero from "../models/Hero.js";
import { cloudinary } from "../config/cloudinary.js";

// @desc    Create new hero section
// @route   POST /api/hero
// @access  Private/Admin
export const createHero = async (req, res) => {
  try {
    const heroData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      heroData.imageUrl = req.file.path;
      heroData.imagePublicId = req.file.filename;
    }
    
    const hero = new Hero(heroData);
    await hero.save();
    
    res.status(201).json({
      success: true,
      message: "Hero section created successfully",
      data: hero
    });
  } catch (error) {
    // Clean up uploaded image if hero creation fails
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Hero section already exists for this page"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to create hero section",
      error: error.message
    });
  }
};

// @desc    Get all hero sections
// @route   GET /api/hero
// @access  Public
export const getAllHeroes = async (req, res) => {
  try {
    const { page, isActive, sort } = req.query;
    
    let query = {};
    
    // Filter by page
    if (page) {
      query.page = page.toLowerCase();
    }
    
    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Sort options
    let sortOption = { order: 1, createdAt: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'name') sortOption = { page: 1 };
    
    const heroes = await Hero.find(query).sort(sortOption);
    
    res.status(200).json({
      success: true,
      count: heroes.length,
      data: heroes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hero sections",
      error: error.message
    });
  }
};

// @desc    Get single hero section by page
// @route   GET /api/hero/:page
// @access  Public
export const getHeroByPage = async (req, res) => {
  try {
    const hero = await Hero.findOne({ 
      page: req.params.page.toLowerCase(),
      isActive: true 
    });
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found for this page"
      });
    }
    
    res.status(200).json({
      success: true,
      data: hero
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hero section",
      error: error.message
    });
  }
};

// @desc    Get single hero section by ID
// @route   GET /api/hero/id/:id
// @access  Public
export const getHeroById = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: hero
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hero section",
      error: error.message
    });
  }
};

// @desc    Update hero section
// @route   PUT /api/hero/:id
// @access  Private/Admin
export const updateHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found"
      });
    }
    
    const updateData = { ...req.body };
    
    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary
      if (hero.imagePublicId) {
        await cloudinary.uploader.destroy(hero.imagePublicId);
      }
      
      updateData.imageUrl = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }
    
    const updatedHero = await Hero.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Hero section updated successfully",
      data: updatedHero
    });
  } catch (error) {
    // Clean up newly uploaded image if update fails
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to update hero section",
      error: error.message
    });
  }
};

// @desc    Delete hero section
// @route   DELETE /api/hero/:id
// @access  Private/Admin
export const deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found"
      });
    }
    
    // Delete image from Cloudinary
    if (hero.imagePublicId) {
      await cloudinary.uploader.destroy(hero.imagePublicId);
    }
    
    await Hero.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: "Hero section deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete hero section",
      error: error.message
    });
  }
};

// @desc    Toggle hero active status
// @route   PATCH /api/hero/:id/toggle
// @access  Private/Admin
export const toggleHeroStatus = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found"
      });
    }
    
    hero.isActive = !hero.isActive;
    await hero.save();
    
    res.status(200).json({
      success: true,
      message: `Hero section ${hero.isActive ? 'activated' : 'deactivated'} successfully`,
      data: hero
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle hero status",
      error: error.message
    });
  }
};

// @desc    Bulk update hero order
// @route   PATCH /api/hero/bulk-order
// @access  Private/Admin
export const bulkUpdateOrder = async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, order }
    
    const updatePromises = orders.map(({ id, order }) =>
      Hero.findByIdAndUpdate(id, { order }, { new: true })
    );
    
    await Promise.all(updatePromises);
    
    const updatedHeroes = await Hero.find().sort({ order: 1 });
    
    res.status(200).json({
      success: true,
      message: "Hero order updated successfully",
      data: updatedHeroes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update hero order",
      error: error.message
    });
  }
};