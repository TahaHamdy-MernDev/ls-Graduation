import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import Logo from "../images/d1logox.png";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUserAction } from "../Redux/Action/userAction";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getAllCategoriesAction } from "../Redux/Action/categoryAction";
const PASSWORD_REGEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
function Registration() {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const interestsRef = useRef(null);
  const [selectedInterests, setSelectedInterests] = useState(null);
  const {categories} = useSelector(state=>state.category)
  useEffect(()=>{
    dispatch(getAllCategoriesAction())
  },[dispatch])
  const categoriesData = categories?.map(category =>{
    return {
      name: category.categoryName,
      value: category._id
    }
  })
  console.log(categoriesData);

  const onSubmit = (data) => {


    delete data.agree;
    data.interests = selectedInterests
    dispatch(registerUserAction(data))
      .unwrap()
      .then(() => {
        Navigate("/login");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const google = (e) => {
    e.preventDefault();
    window.open("http://localhost:4000/api/v1/auth/google/signin", "_self");
  };
  const { t } = useTranslation();
  return (
    <Container dir={i18n.dir()} className="reg-sec">
      <Row className="justify-content-center">
        <Col lg={6} sm={12}>
          <div className="image-div-form">
            <img src={Logo} alt="form-logo" />
          </div>
        </Col>
        <Col lg={6} sm={12}>
          <Form className="form2 p-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="buttons">
              <button className="btn4" onClick={google}>
                {t("registration.googleButtonText")}
              </button>
              <hr />
            </div>

            <Form.Group
              className="mb-3  register-group"
              controlId="formBasicEmail"
            >
              <Form.Label className="label1 p-2">
                {t("registration.firstNameLabel")}
              </Form.Label>
              <Form.Control
                className={`form-control ${
                  errors.firstName ? "is-invalid" : ""
                }`}
                {...register("firstName", { required: true })}
                type="text"
                placeholder={t("registration.firstNameLabel")}
              />
            </Form.Group>

            <Form.Group
              className="mb-3 register-group"
              controlId="formBasicEmail"
            >
              <Form.Label className="label1">
                {t("registration.lastNameLabel")}
              </Form.Label>
              <Form.Control
                className={`form-control ${
                  errors.lastName ? "is-invalid" : ""
                }`}
                {...register("lastName", { required: true })}
                type="text"
                placeholder={t("registration.lastNameLabel")}
              />
            </Form.Group>
       
            <Form.Group
              className="mb-3 register-group"
              controlId="formBasicPassword"
            >
              <Form.Label className="label1">
                {t("registration.emailLabel")}
              </Form.Label>
              <Form.Control
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                type="email"
                placeholder={t("registration.emailLabel")}
              />
            </Form.Group>
            <Form.Group className="mb-3 register-group">
            <Form.Label className="label1">
               InterestingIn
              </Form.Label>
              <div style={{width:"100%"}} className="card p-fluid mt-2">
                <MultiSelect
                  filter
                  value={selectedInterests}
                  ref={interestsRef}
                  onChange={(e) => setSelectedInterests(e.value)}
                  options={categoriesData}
                
                  optionLabel="name"
                />
              </div>
            </Form.Group>
            <Form.Group
              className="mb-3 register-group"
              controlId="formBasicPassword"
            >
              <Form.Label className="label1">
                {t("registration.passwordLabel")}
              </Form.Label>
              <Form.Control
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                {...register("password", {
                  required: true,
                  pattern: PASSWORD_REGEXP,
                })}
                type="password"
                placeholder={t("registration.passwordLabel")}
              />
              {errors.password && (
                <span className="error-msg">
                  {t("registration.passwordRequirements")}
                </span>
              )}
            </Form.Group>

            <Form.Group
              className="register-group-check"
              controlId="formBasicCheckbox"
            >
              <Form.Check
                className="checked"
                {...register("agree", { required: true })}
                type="checkbox"
              />
              {errors.agree && (
                <span className="error-msg">
                  {t("registration.agreeError")}
                </span>
              )}
              <Form.Label className="label1">
                {t("registration.agreeLabel")}
              </Form.Label>
            </Form.Group>

            <Button variant="primary" className="btn" type="submit">
              {t("registration.submitButton")}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Registration;
