var express = require('express');
var router = express.Router();

const mongoose = require('mongoose')
const {Schema} = mongoose;
  const uri =  "mongodb+srv://admin1:tudm02@cluster0.nfsjbrz.mongodb.net/test";
mongoose.connect(uri).catch(err => console.log('Log: ' + err));
// định nghĩa khung, model hay  gọi là Schema cho đối tượng Images
// thư viện mongoose này dùng Schema để đọc, ghép, thêm dữ liệu vào DB
const imagesSchema = new Schema({
  content: 'string',
  date: 'string',
  linkImg: 'string'
});
const ImagesAss = mongoose.model('images_ass_server', imagesSchema);

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});
//Chuyen sang trang add
router.get('/add', async function (req, res) {
  console.log('add')
  var imgs = await ImagesAss.find({});

  res.render('add', {title: 'Add', data: imgs});
})
//add IMG
router.post('/addImg', async function (req, res) {
  var content = req.body.content;
  var date = req.body.date;
  var linkImg = req.body.linkImg;

  const images = new ImagesAss({
    content: content,
    date: date,
    linkImg: linkImg,
  })
  await images.save();
  // lấy lại danh sách và hiển thị trên trang add
  ImagesAss.find({}, function (error, result) {
    res.render('add', {data: result})
  })
});
//Delete
router.get('/deleteIMG', async function (req, res, next) {

  await ImagesAss.deleteOne({_id: req.query.id})

  res.redirect('/add');
});
//View
router.get('/view', async function (req, res, next) {
  var imgass = await ImagesAss.find({_id: req.query.id})
  res.render('viewIMG', {data: (imgass[0])})
});
//chuyen sang tab updateImgAss
router.get('/update', function (req, res) {
  var id = req.query.id;
  const ImagesAss = mongoose.model('images_ass_server', imagesSchema);
  ImagesAss.findOne({id: id}, function (error, result) {
    res.render('updateIMG', {Ass: result})
  })
})
//update ảnh
router.post('/updateImgAss', async function (req, res) {
  // lấy ra các tham số
  var id = req.body.id;
  var content = req.body.content;
  var date = req.body.date;
  var linkImg = req.body.linkImg;

  console.log(id + content + date + linkImg);

  const newimages = {
    content: content,
    date: date,
    linkImg: linkImg,
  }
  await ImagesAss.updateOne({_id: id}, {
    content: content,
    date: date,
    linkImg: linkImg,
  });

  ImagesAss.find({}, function (error, result) {
    res.render('add', {data: result})
  })

})
module.exports = router;
