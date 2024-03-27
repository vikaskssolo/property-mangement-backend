import { Router } from "express";
import wishlist from "./wishlist.js";
import myWishlist from "./myWishlists.js";
import removeWishlist from "./removeWishlist.js";
const router = Router();

router.use("/wishlist/add", wishlist);
router.use("/my/wishlists", myWishlist);
router.use("/wishlist/remove", removeWishlist);

export default router;
