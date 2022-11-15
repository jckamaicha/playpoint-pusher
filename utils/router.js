const {
  getMarketplaces,
  newMarketplace,
  updateMarketplace,
  deleteMarketplace,
  getSpecificMarketplace,
} = require("../api/controllers/Marketplace");
const {
  getSpecificFixtureController,
  getFixturesController,
  newFixtureController,
  updateFixturesController,
  deleteFixturesController,
  getFixturesByMarketplaceSlugController,
} = require("../api/controllers/Fixture");
const {
  getQuestionaireController,
  newQuestionaireController,
  updateQuestionaireController,
  deleteQuestionaireController,
} = require("../api/controllers/Questionaires");
const { multerUpload } = require("./MulterConfig");
const {
  getResultController,
  newResultController,
  updateResultController,
  deleteResultController,
} = require("../api/controllers/Result");
const { getCountStatus } = require("../api/helpers/adminStats");

const APIRouter = require("express").Router();

/**
 * ****************************************************************
 *                   Marketplace API Routers
 * ****************************************************************
 */
APIRouter.get("/marketplace-specific/:marketplaceSlug", getSpecificMarketplace)
  .get("/marketplace", getMarketplaces)
  .post(
    "/new-marketplace",
    multerUpload.single("marketplaceCoverImage"),
    newMarketplace
  )
  .patch("/update-marketplace/:marketplaceSlug", updateMarketplace)
  .delete("/delete-marketplace/:marketplaceSlug", deleteMarketplace);

/**
 * ****************************************************************
 *                     Fixture API Routers
 * ****************************************************************
 */
APIRouter.get("/fixture", getFixturesController)
  .get("/fixture-specific", getSpecificFixtureController)
  .get("/fixture-marketplace/:marketplaceSlug", getFixturesByMarketplaceSlugController)
  .post("/new-fixture", newFixtureController)
  .patch("/update-fixture", updateFixturesController)
  .delete("/delete-fixture", deleteFixturesController);

/**
 * ****************************************************************
 *                    Questionaires API Routers
 * ****************************************************************
 */
APIRouter.get("/questionaires", getQuestionaireController)
  .post("/new-questionaire", newQuestionaireController)
  .patch("/update-questionaire", updateQuestionaireController)
  .delete("/delete-questionaire", deleteQuestionaireController);

/**
 * ****************************************************************
 *                       Results API Routers
 * ****************************************************************
 */
APIRouter.get("/results", getResultController)
  .post("/new-result", newResultController)
  .patch("/update-result", updateResultController)
  .delete("/delete-result", deleteResultController);

/**
 * ****************************************************************
 *                       Active Prediction
 * ****************************************************************
 */
// APIRouter.get("/active-prediction")

/**
 * ****************************************************************
 *                       Admin Status
 * ****************************************************************
 */
APIRouter.get("/admin-stats", getCountStatus);

module.exports = APIRouter;
