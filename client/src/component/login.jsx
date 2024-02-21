import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import logo from "../images/d1logox.png";
import { Container, Col, Row } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { currentUserAction, loginUserAction } from "../Redux/Action/userAction";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

function Form1() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    dispatch(loginUserAction(data))
      .unwrap()
      .then(() => {
        dispatch(currentUserAction())
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  const google = (e) => {
    e.preventDefault();
    window.open("http://localhost:4000/api/v1/auth/google/signin", "_self");
  };
  return (
    <div id="second-sec" className="sec2" dir={i18n.dir()}>
      <Container className="sec2-div">
        <Row className="align-items-center">
          <Col lg={6} sm={12} className="justify-content-center">
            <div className="image-div-form">
              <img src={logo} alt="animation2" />
            </div>
          </Col>
          <Col lg={6} sm={12} className="f1">
            <Form className="form1 p-2" onSubmit={handleSubmit(onSubmit)}>
              <span className="link-form">{t("loginPage.loginTitle")}</span>
              <Row className="justify-content-center">
                <Col size={12} sm={12} className="px-1">
                  <Form.Control
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email", { required: true })}
                    type="Email"
                    placeholder={t("loginPage.emailPlaceholder")}
                    id="t1"
                  />
                </Col>
                <Col size={12} sm={12} className="px-1">
                  <Form.Control
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    {...register("password", { required: true })}
                    type="password"
                    placeholder={t("loginPage.passwordPlaceholder")}
                    id="t1"
                  />
                  {errors.password && (
                    <span className="error-msg">
                      {t("loginPage.requiredFieldError")}
                    </span>
                  )}
                </Col>
                <Col size={12} sm={12} className="px-1">
                  <Button variant="primary" type="submit" className="btn3">
                    {t("loginPage.submitButton")}
                  </Button>
                  <br />
                  <span>{t("loginPage.orLabel")}</span>
                </Col>

                <Col
                  size={12}
                  sm={12}
                  className="px-2 mt-2 d-flex align-items-center justify-content-center"
                >
                  <Button
                    variant="outline-dark "
                    style={{ backgroundColor: "#dd4b39", fontSize: "13px" }}
                    className="btn btn-lg btn-block btn-primary"
                    onClick={google}
                  >
                    <FaGoogle className="google-icon m-1" />
                    {t("loginPage.googleLoginButton")}
                   
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Form1;
