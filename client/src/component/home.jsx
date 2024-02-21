import { useEffect } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { BsArrowDownCircle } from "react-icons/bs";

import Logo1 from "../images/d1logox.png";
import Logo2 from "../images/cpp1.jpg";
import Logo3 from "../images/ja1.png";
import Logo4 from "../images/php2.jpg";
import Logo5 from "../images/rr1.png";
import Logo6 from "../images/pla1.png";
import Logo7 from "../images/py4.jpg";
import Logo8 from "../images/b1.jpg";
import Logo9 from "../images/b2.png";
import Logo10 from "../images/main.png";
import Logo11 from "../images/ud1.png";
import Logo12 from "../images/y2.png";
import Logo13 from "../images/y3.jpg";
import Logo14 from "../images/y4.jpg";
import Logo16 from "../images/y5.jpg";
import Logo17 from "../images/y6.jpg";
import Logo18 from "../images/back2.jpg";


import Logo19 from '../images/team1.jpg';
import Logo20 from '../images/team2.jpg';
import Logo21 from '../images/team3.jpg';
import Logo22 from '../images/team4.jpg';
import Logo23 from '../images/Screenshot\ 2023-12-04\ 180258.png';


import Logo15 from "../images/Screenshot 2023-12-04 180258.png";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchCoursesAction } from "../Redux/Action/courseAction";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getAllBookAction } from "../Redux/Action/bookAction";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { getAllCategoriesAction } from "../Redux/Action/categoryAction";
import { FaDownload } from "react-icons/fa";
import { FaCircleQuestion } from "react-icons/fa6";
import { FaBookOpenReader } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
function Home() {
  const { register, handleSubmit, watch } = useForm();
  const { courses } = useSelector((state) => state.course);
  const {currentUser } =useSelector(state => state.user);
  const { books } = useSelector((state) => state.book);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { categories: AllCategories } = useSelector((state) => state.category);
  useEffect(() => {
    dispatch(fetchCoursesAction());
    dispatch(getAllBookAction());
    dispatch(getAllCategoriesAction());
  }, [dispatch]);
  const onSubmit = (data) => {
    if (
      data.selectedCategory !== (undefined || " ") &&
      data.category !== (undefined || " ")
    ) {
      navigate(
        `/search-results?category=${data.category}&selectedCategory=${data.selectedCategory}`
      );
    }
  };
  const inputStyles = {
    outline: "none",
    border: "1px solid rgb(0, 174, 255)",
    width: "200px",
    height: "40px",
    borderRadius: "30px",
    paddingRight: "35px",
  };
  const selectedCategory = watch("category");
  const categories =
    selectedCategory === "course"
      ? Array.from(
          new Set(
            courses ? courses.map((course) => course.category.categoryName) : []
          )
        )
      : selectedCategory === "book"
      ? Array.from(
          new Set(books ? books.map((book) => book.category.categoryName) : [])
        )
      : [];
     
 
 
  return (
    <section className="home-sec">
    <div className="container-home">
      <Container>
        <Row className="align-items-center">
          <Col lg={12} md={12} sm={12}>
            <div className="home">
              <h2 className="home__title">أهلا بك في منصة <br />أبواب البرمجية</h2>
            
             {!currentUser && (<>
               <p> للاستماتاع بخدمات ابواب البرمجية تفضل بالدخول للمنصة </p>
                <Nav className="my-6">
                <Nav.Link id="button1" href="/login">
                  تسجيل الدخول
                </Nav.Link>
                <Nav.Link id="button2" href="/register">
                  حساب جديد
                </Nav.Link>
              </Nav>
             </>
              
             ) 

             }
            
            </div>
            <Row className="justify-content-center mt-4">
              <Col md={12} sm={12}>
                <div className="content">
                  <a href="#">
                    <FaFacebook className="icon-content" />
                  </a>
                  <a href="#">
                    <FaInstagram className="icon-content" />
                  </a>
                  <a href="#">
                    <FaLinkedin className="icon-content" />
                  </a>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>

    <Row className="justify-content-center">
      <Col md={12} sm={12}>
        <div className="home-about">
          <div className="about">
            <h4>نبذة عنا</h4>
            <p>
              توفر منصة ابواب البرمجية التعليم والتدريب عبر الانترنت كما توفر
              بيىة افتراضية للتعليم والتدريب تتميز بعدة مزايا منها المرونه
              الزمنية والمكانية التي تساعد الطالب بالدراسة ةالتدريب بسهولة
              توفر منصتنا العديد من الكتب والكورسات التي تستطيع الاستفادة من
              خلالها املين ان تنال اعجابكم
            </p>
          </div>

          <div className="about-img">
            <img src={Logo19} alt="logo" />
          </div>
        </div>
      </Col>
    </Row>

    <Row className="justify-content-center">
      <Col lg={12} md={12} sm={12}>
      <div className="hero with-image">
        <div className="container main-container">
          <div className="row">
            <div className="col-lg-8 m-auto">
              <h1 className="hero-title">تعلم البرمجة من الصفر حتى الاحتراف</h1>
              <h2 className="hero-secondary-title">
                توفر لك منصة أبواب البرمجية محتوى عربي شامل ومتنوع لنساعدك في تعلم
                البرمجة بكل احترافية وسهولة
              </h2>
              <Link to="courses" className="btn btn-primary btn-lg mt-3">
                تعلم البرمجة الآن
              </Link>
            </div>
          </div>
        </div>
      </div>
        {/* <div className="card-home">
          <img src={Logo23} alt="Logo"/>
           </div> */}
      </Col>
    </Row>
    <Row className="justify-content-center">
      <Col md={6} sm={12}>
        <h2 className="title-fea">المميزات</h2>
        <div className="featurs">
          <div className="card">
            <FaDownload className="icon" />
            <h6> تحميل الكتب</h6>
            <span>
              {" "}
              تستطيع من خلال منصتنا ان تقوم بتحميل الكتب والكورسات{" "}
            </span>
          </div>

          <div className="card">
            <FaBookOpenReader className="icon" />
            <h6>دورات</h6>
            <span>
              تقدم منصتنا العديد من الدورات المتعلقة بالبرمجة بمكنك الاستفاده
              منها
            </span>
          </div>
          <div className="card">
            <FaCircleQuestion className="icon" />
            <h6>اسئلة واجوبة</h6>
            <span>تتيح المنصه الامكانيه لطؤح الاسئلة والاجابة عليها </span>
          </div>
        </div>
      </Col>
    </Row>
    <Row className="justify-content-center">
      <Col lg={12} md={12} sm={12}>
        <div className="num">
          <div className="num-content">
            <FaUserCheck className="icon" />
            <p>عدد المستخدمين</p>
            <p>135.24</p>
          </div>

          <div className="num-content">
            <FaDownload className="icon" />
            <p>عدد التحميلات</p>
            <p>543.24</p>
          </div>

          <div className="num-content">
            <FaBookOpenReader className="icon" />
            <p>عدد الكتب</p>
            <p>3435.24</p>
          </div>
        </div>
      </Col>
    </Row>
    <Row className="justify-content-center">
      <Col md={12} sm={12}>
        <div className="ourteam">
          <div>
            <h2>فريقنا الاكاديمي</h2>
            <p>
              يوجد في منصتنا فريق مكون من كفأ المدرسين والمدربين على درجة
              عالية من المعرفة والعلم
            </p>
          </div>
          <div className="team">
            <img src={Logo20}></img>
            <h4> أحمد ابوالرب</h4>
            <p>
              مهندس علم حاسوب من جامعة البلقاء التطبيقية يدرس مادة علم حاسب
              الي
            </p>
          </div>
          <div className="team">
            <img src={Logo21}></img>
            <h4> أحمد ابوالرب</h4>
            <p>
              مهندس علم حاسوب من جامعة البلقاء التطبيقية يدرس مادة علم حاسب
              الي
            </p>
          </div>
          <div className="team">
            <img src={Logo22}></img>
            <h4> أحمد ابوالرب</h4>
            <p>
              مهندس علم حاسوب من جامعة البلقاء التطبيقية يدرس مادة علم حاسب
              الي
            </p>
          </div>
        </div>
      </Col>
    </Row>
  </section>
  );
}
export default Home;
//   <Container dir={i18n.dir()}>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Row className="justify-content-center">
//           <Col lg={2} md={6} sm={12}>
//             <div className="home-div">
//               <img src={Logo1} alt="logo" />
//             </div>
//           </Col>

//           <Col lg={2} md={6} sm={12}>
//             <div className="home-div">
//               <h5>{t("homePage.searchFor")}</h5>

//               <select
//                 defaultValue={" "}
//                 required
//                 style={inputStyles}
//                 {...register("category", { required: true })}
//               >
//                 <option value=" " disabled>
//                   {t("homePage.selectPlaceholder")}
//                 </option>
//                 <option value="course">{t("homePage.course")}</option>
//                 <option value="book">{t("homePage.book")}</option>
//               </select>
//               <BsArrowDownCircle className="icon1" />
//             </div>
//           </Col>

//           <Col lg={2} md={6} sm={12}>
//             <div className="home-div">
//               <h5>{t("homePage.category")}</h5>
//               <select
//                 required
//                 style={inputStyles}
//                 defaultValue={" "}
//                 {...register("selectedCategory", { required: true })}
//               >
//                 <option value=" " disabled>
//                   {t("homePage.selectPlaceholder")}
//                 </option>
//                 {categories?.map((category) => (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
//               <BsArrowDownCircle className="icon1" />
//             </div>
//           </Col>

//           <Col lg={2} md={6} sm={12}>
//             <div className="home-div">
//               <button type="submit" className="link-home">
//                 {t("homePage.search")}
//               </button>
//             </div>
//           </Col>
//         </Row>
//       </form>

//       <Row className="justify-content-center">
//         <Col sm={12}>
//         <div className="img-div">
//   {AllCategories &&
//     AllCategories.length > 0 &&
//     AllCategories.slice(0, 5).map((cat, index) => (
//       <Link key={index} to={`/category/${cat._id}`}>
//         <img src={cat.categoryImage.url} alt="logo" />
//       </Link>
//     ))}
// </div>

//         </Col>
//       </Row>

//       <Row>
//         <Col xs>
//           <h4 className="title1">{t("homePage.bestEducationalPlatforms")}</h4>
//         </Col>
//       </Row>

//       <Row className="justify-content-center">
//         <Col sm={12}>
//           <div className="imgdiv">
//             <a href="https://elzero.org/" target="_blank" rel="noreferrer">
//               <img className="img-home" src={Logo8} alt="image1" />
//             </a>
//             <a href="https://academy.hsoub.com/" target="_blank" rel="noreferrer">
//               <img className="img-home" src={Logo9} alt="image1" />
//             </a>

//             <a href="https://www.codezilla.courses/" target="_blank" rel="noreferrer">
//               <img className="img-home" src={Logo10} alt="image1" />
//             </a>

//             <a href="https://www.datacamp.com/" target="_blank" rel="noreferrer">
//               <img className="img-home" src={Logo6} alt="image1" />
//             </a>

//             <a href="https://www.udemy.com/" target="_blank" rel="noreferrer">
//               <img className="img-home" src={Logo11} alt="image1" />
//             </a>
//           </div>
//         </Col>
//       </Row>

//       <Row className="align-items-center ">
//         <Col lg={12} sm={12}>
//           <div className="img-div2">
//             <a href="https://academy.hsoub.com/" target="_blank" rel="noreferrer">
//               <img className="img-home" src={Logo15} alt="image1" />
//             </a>
//             {/* <img src={Logo15} alt="image11" /> */}
//           </div>
//         </Col>
//       </Row>

//       <Row>
//         <Col xs>
//           <h4 className="title1">{t("homePage.bestCourses")}</h4>

//           <br />
//         </Col>
//       </Row>

//       {courses?.length > 0 ? (
//         <Row className="justify-content-center">
//           {courses.map((course) => (
//             <Col lg={4} sm={12} md={6} key={course._id}>
//               <Link to={`/course-details/${course._id}`}>
//                 {course.image ? (
//                   <img
//                     className="img3"
//                     src={`${course.image.url}`}
//                     alt={`course-${course._id}`}
//                   />
//                 ) : (
//                   <div className="placeholder-image">Placeholder Image</div>
//                 )}
//               </Link>
//             </Col>
//           ))}
//         </Row>
//       ) : (
//         <div className="no-courses-message">
//           {t("homePage.noCoursesMessage")}
//         </div>
//       )}

//       <Row>
//         <Col xs>
//           <h5 className="title1">{t("Recommended Youtupe Channels")}</h5>

//           <br />

//           <div className="imgdiv">
//             <a href="https://www.youtube.com/@NetNinja" target="_blank" rel="noreferrer">
//               <img className="img-home1" src={Logo12} alt="image1" />
//             </a>
//             <a
//               href="https://www.youtube.com/@programmingwithmosh"
//               target="_blank" rel="noreferrer"
//             >
//               <img className="img-home1" src={Logo13} alt="image1" />
//             </a>

//             <a href="https://www.youtube.com/c/CSDojo/videos" target="_blank" rel="noreferrer">
//               <img className="img-home1" src={Logo14} alt="image1" />
//             </a>

//             <a
//               href="https://www.youtube.com/@javascriptmastery"
//               target="_blank" rel="noreferrer"
//             >
//               <img className="img-home1" src={Logo16} alt="image1" />
//             </a>

//             <a href="https://www.udemy.com/" target="_blank" rel="noreferrer">
//               <img className="img-home1" src={Logo17} alt="image1" />
//             </a>
//           </div>
//         </Col>
//       </Row>

//       <Row className="align-items-center ">
//         <Col lg={20} sm={20}>
//           <div className="img-div2">
//             <img src={Logo18} alt="image11" />
//           </div>
//         </Col>
//       </Row>
//     </Container>