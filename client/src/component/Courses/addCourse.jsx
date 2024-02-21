import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import uploadImage from "../../images/upload.png";
import { useDispatch } from "react-redux";
import { createCourseAction } from "../../Redux/Action/courseAction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllCategoriesAction } from "../../Redux/Action/categoryAction";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
import { Oval } from "react-loader-spinner";
function AddCourse() {
  // Hooks for internationalization
  const { t } = useTranslation();

  // Hooks for form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Hooks for component-level state
  const [whatYouWillLearn, setWhatYouWillLearn] = useState([""]);
  const [durationUnit, setDurationUnit] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  // Hooks for Redux state and actions
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.category);
  const { addCourseLoading } = useSelector((state) => state.course);

  // Event handler for duration unit change
  const handleDurationUnitChange = (e) => {
    setDurationUnit(e.target.value);
  };

  // Event handler for adding a learning point
  const handleAddLearnPoint = () => {
    setWhatYouWillLearn([...whatYouWillLearn, ""]);
  };

  // Event handler for changing a learning point
  const handleLearnPointChange = (index, value) => {
    const updatedPoints = [...whatYouWillLearn];
    updatedPoints[index] = value;
    setWhatYouWillLearn(updatedPoints);
  };

  // Event handler for removing a learning point
  const handleRemoveLearnPoint = (index) => {
    const updatedPoints = [...whatYouWillLearn];
    updatedPoints.splice(index, 1);
    setWhatYouWillLearn(updatedPoints);
  };

  // Event handler for handling the drop of the cover image
  const onDropCoverImage = (acceptedFiles) => {
    setCoverImage(acceptedFiles[0]);
  };

  // Dropzone configuration
  const {
    getRootProps: getRootCoverImageProps,
    getInputProps: getInputCoverImageProps,
  } = useDropzone({
    onDrop: onDropCoverImage,
    accept: "image/*",
  });

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getAllCategoriesAction());
  }, [dispatch]);

  // Form submission logic
  const onSubmit = (data) => {
    if (!coverImage) {
      return toast.error("Please add an image for the course");
    }
    const { durationDays, durationHours, ...restData } = data;
    const duration = { value: durationUnit === "days" ? durationDays : durationHours, unit: durationUnit };
    const updatedData = { ...restData, whatUWillLearn: whatYouWillLearn, image: coverImage, duration };

    dispatch(createCourseAction(updatedData))
       .unwrap()
       .then(() => {
         toast.success("Course created successfully");
         navigate("/admin-course");
       })
       .catch((err) => {
         toast.error(err.message);
       });
  };
  return (
    <Container dir={i18n.dir()}>
        <h2 className="card-code-title mt-2 mb-2">{t('addCourse.addNewCourse')}</h2>
      <Form  className="form-coursesadd" onSubmit={handleSubmit(onSubmit)}>
      
        <Row className="justify-content-start">
          <Col lg={6} md={12}>
            <Form.Group controlId="courseName" className="mb-2">
              <Form.Label className="label">{t('addCourse.courseName')}</Form.Label>
              <Form.Control
              id="text"
                type="text"
                placeholder={t('addCourse.courseName')}
                {...register("name", { required: true })}
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
              />
            </Form.Group>
            <Form.Group controlId="courseSubTitle" className="mb-2">
              <Form.Label  className="label">{t('addCourse.courseSubTitle')}</Form.Label>
              <Form.Control
              id="text"
                type="text"
                placeholder={t('addCourse.courseSubTitle')}
                {...register("courseSubTitle", { required: true })}
                className={`form-control ${errors.subDescription ? "is-invalid" : ""}`}
              />
            </Form.Group>
            <Form.Group controlId="instructor" className="mb-2">
              <Form.Label className="label">{t('addCourse.instructor')}</Form.Label>
              <Form.Control
              id="text"
                type="text"
                placeholder={t('addCourse.instructor')}
                {...register("instructor", { required: true })}
                className={`form-control ${errors.instructor ? "is-invalid" : ""}`}
              />
            </Form.Group>

            <Form.Group controlId="coursePrice" className="mb-2">
              <Form.Label  className="label">{t('addCourse.coursePrice')}</Form.Label>
              <Form.Control
              id="text"
                type="number"
                placeholder={t('addCourse.coursePrice')}
                {...register("price", { required: true })}
                className={`form-control ${errors.price ? "is-invalid" : ""}`}
              />
            </Form.Group>
            <Form.Group controlId="courseLevel" className="mb-2">
              <Form.Label className="label">{t('addCourse.courseLevel')}</Form.Label>
              <Form.Control
              id="text"
                as="select"
                name="level"
                {...register("level", { required: true })}
                className={`form-control ${errors.level ? "is-invalid" : ""}`}
                defaultValue={" "}
              >
                <option value=" " disabled>
                  {t('addCourse.selectCourseLevel')}
                </option>
                <option value="beginner">{t('addCourse.beginner')}</option>
                <option value="intermediate">{t('addCourse.intermediate')}</option>
                <option value="advanced">{t('addCourse.advanced')}</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCategory" className="mb-2">
              <Form.Label  className="label">{t('addCourse.selectCategory')}</Form.Label>
              <Form.Control
              id="text"
                as="select"
                name="category"
                {...register("category", { required: true })}
                className={`form-control ${errors.category ? "is-invalid" : ""
                  }`}
              >
                <option value="" disabled>
                  {t('addCourse.selectCategory')}
                </option>
                {categories && categories.map((category, index) => (
                  <option key={index} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group >
            <Form.Group controlId="courseDescription" className="mb-2">
              <Form.Label  className="label">{t('addCourse.courseDescription')}</Form.Label>
              <Form.Control
              id="text"
                as="textarea"
                rows={4}
                placeholder={t('addCourse.courseDescription')}
                {...register("description", { required: true })}
                className={`form-control ${errors.description ? "is-invalid" : ""
                  }`}
              />
            </Form.Group>
          </Col>
          <Col lg={6} md={12}>


            <Form.Group controlId="courseLink" className="mb-2">
              <Form.Label className="label">{t('addCourse.courseLink')}</Form.Label>
              <Form.Control
              id="text"
                type="text"
                placeholder={t('addCourse.courseLink')}
                {...register("link", { required: true })}
                className={`form-control ${errors.link ? "is-invalid" : ""}`}
              />
            </Form.Group>
            <Form.Group controlId="courseDuration" className="mb-2">
              <Form.Label  className="label">{t('addCourse.selectDuration')}</Form.Label>
              <Form.Control
              id="text"
                as="select"
                onChange={handleDurationUnitChange}
                value={durationUnit}
              >
                <option value="" disabled>
                  {t('addCourse.selectDuration')}
                </option>
                <option value="days">{t('addCourse.days')}</option>
                <option value="hours">{t('addCourse.hours')}</option>
              </Form.Control>
            </Form.Group>

            {durationUnit === "days" && (
              <Form.Group controlId="courseDurationDays" className="mb-2">
                <Form.Label  className="label">{t('addCourse.courseDurationDays')}</Form.Label>
                <Form.Control
                id="text"
                  type="number"
                  placeholder={t('addCourse.courseDurationDays')}
                  {...register("durationDays", { required: true })}
                  className={`form-control ${errors.durationDays ? "is-invalid" : ""}`}
                />
              </Form.Group>
            )}

            {durationUnit === "hours" && (
              <Form.Group controlId="courseDurationHours" className="mb-2">
                <Form.Label className="label">{t('addCourse.courseDurationHours')}</Form.Label>
                <Form.Control
                id="text"
                  type="number"
                  placeholder={t('addCourse.courseDurationHours')}
                  {...register("durationHours", { required: true })}
                  className={`form-control ${errors.durationHours ? "is-invalid" : ""}`}
                />
              </Form.Group>
            )}

            <Form.Group controlId="whatYouWillLearn" className="mb-2">
              <Form.Label  className="label">{t('addCourse.whatYouWillLearn')}</Form.Label>
              {whatYouWillLearn.map((point, index) => (
                <div key={index} className="d-flex mb-2 gap-2">
                  <Form.Control
                  id="text"
                    type="text"
                    placeholder={`${t('addCourse.whatYouWillLearn')} ${index + 1}`}
                    value={point}
                    onChange={(e) =>
                      handleLearnPointChange(index, e.target.value)
                    }
                    className="me-2"
                  />
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveLearnPoint(index)}
                  >
                    {t('addCourse.removeLearnPoint')}
                  </Button>
                </div>
              ))}
              <Button
                variant="primary"
                className="mt-2"
                onClick={handleAddLearnPoint}
              >
                {t('addCourse.addLearnPoint')}
              </Button> 
            </Form.Group>
            <Form.Group controlId="formCoverImage" className="mb-4">
              <Form.Label className="label">{t('addCourse.coverImage')}</Form.Label>
              <div
                {...getRootCoverImageProps()}
                className="dropzone border rounded p-3 cursor-pointer"
              >
                <input {...getInputCoverImageProps()} />
                {coverImage ? (
                  <Image
                    src={URL.createObjectURL(coverImage)}
                    alt="Cover Image Preview"
                    fluid
                    className="img-sug mb-3"
                  />
                ) : (
                  <Image
                    src={uploadImage}
                    alt="Placeholder Image"
                    fluid
                    className="img-sug mb-3"
                  />
                )}
                <p className="text-muted small">
                  {t('addCourse.dropzoneText')}
                </p>
              </div>
              {errors.coverImage && (
                <p className="text-danger mt-1">{errors.coverImage.message}</p>
              )}
            </Form.Group>
          </Col>
          <Row>
            <Col>
              <Button disabled={addCourseLoading} variant="primary" type="submit" style={{ display: "flex", justifyItems: "center", alignItems: "center", gap: "2px" }}>
                {addCourseLoading ? (
                  <Oval
                    strokeColor="white"
                    strokeWidth="5"
                    color="#4fa94d"
                    ariaLabel="oval-loading"
                    animationDuration="0.75"
                    width="40"
                    height="30"
                    visible={true}
                  />
                )
                  :
                  t('addCourse.addCourseButton')
                }
              </Button>
            </Col>
          </Row>
        </Row>
      </Form>
    </Container>
  );
}

export default AddCourse;
