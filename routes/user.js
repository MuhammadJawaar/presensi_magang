const express = require('express');
const userController = require('../controllers/user.controller');
const checkAuthMiddleware = require('../middleware/check-auth');

const router = express.Router();

router.get("/tugas/list", checkAuthMiddleware.checkAuthPeserta, userController.showTugasList);
router.get("/tugas/:id", checkAuthMiddleware.checkAuthPeserta, userController.showTugas); //cek token
router.patch("/tugas/:tid/submit", checkAuthMiddleware.checkAuthPeserta, imageUploader.upload.single('image'), (req, res) =>{
    if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded',
        });
      }

      const uploadedFileUrl = req.file.path;
      userController.doTugas(req,res,uploadedFileUrl);
}); //cek token
router.get('/presensi/:id', checkAuthMiddleware.checkAuthPeserta, userController.showPresensi); //cek token
router.patch('/presensi/:id/up', checkAuthMiddleware.checkAuthPeserta, imageUploader.upload.single('image'), (req, res) =>{
    if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded',
        });
      }

      const uploadedFileUrl = req.file.path;
      userController.doPresensi(req,res,uploadedFileUrl); //cek token
});
router.patch('/peserta/:id/edit', checkAuthMiddleware.checkAuthPeserta, userController.editPassword); //cek token

module.exports = router;