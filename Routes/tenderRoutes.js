// backend/routes/tenderRoutes.js
const express = require('express');
const tenderController = require('../Controller/tenderController');

const router = express.Router();


router.get('/tenders', tenderController.getalltenders);

router.post('/tenders/filter', tenderController.getbyfilterandsearch);
router.post('/tenders/:id', tenderController.gettenderbyID);
router.post('/tender/location', tenderController.getTenderByLocation);
router.post('/gettenderbydepartment', tenderController.getTenderByDepartment);
router.post('/gettenderbyclassification', tenderController.getTenderByClassification);
router.post('/gettenderbysanctiondate', tenderController.getTenderBySanctionDate);
router.post('/gettenderbysanctionamount', tenderController.getTenderBySanctionAmount);
router.post('/gettenderbycompletiondate', tenderController.getTenderByCompletionDate);
router.post('/gettenderbytotaldurationdays', tenderController.getTenderByTotalDurationDays);
router.post('/gettenderbypriorities', tenderController.getTenderByPriorities);
router.post('/gettenderbycancelaccepttenders', tenderController.getTenderByCancelAcceptTender);
router.post('/gettenderbystatus', tenderController.getTenderByTenderStatus);
router.post('/gettenderbycompletedpending', tenderController.getTenderByCompletedPending);
router.post('/gettenderbyagency', tenderController.getTenderByTenderAcquiredByAgency);
router.post('/gettenderbypincode', tenderController.getTenderByPincode);


router.post('/add', tenderController.addTender);
router.post('/checkclashes', tenderController.checkClashes);


module.exports = router;
