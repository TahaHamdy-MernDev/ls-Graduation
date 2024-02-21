import  { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllCategoriesAction } from "../../Redux/Action/categoryAction";
import { fetchCoursesAction, updateCourseByIdAction } from "../../Redux/Action/courseAction";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { Oval } from "react-loader-spinner";

function EditCourse() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchCoursesAction());
  }, [dispatch]);

  const courseToEdit = useSelector((state) =>
  state.course.courses?.find((course) => course._id === id)
);
  
  const { categories } = useSelector((state) => state.category);
  const { editCourseLoading } = useSelector((state) => state.course);
  const [coverImage, setCoverImage] = useState(null);
 
  const [whatYouWillLearn, setWhatYouWillLearn] = useState([""]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  let unit = `${courseToEdit?.duration.unit}`
  const [durationUnit, setDurationUnit] = useState(unit);
  // Event handler for duration unit change
  const handleDurationUnitChange = (e) => {
    setDurationUnit(e.target.value);
  };
  const handleAddLearnPoint = () => {
    setWhatYouWillLearn([...whatYouWillLearn, ""]);
  };
  const coverImageUrl = `${courseToEdit?.image?.url}`;
  const handleLearnPointChange = (index, value) => {
    const updatedPoints = [...whatYouWillLearn];
    updatedPoints[index] = value;
    setWhatYouWillLearn(updatedPoints);
  };

  const handleRemoveLearnPoint = (index) => {
    const updatedPoints = [...whatYouWillLearn];
    updatedPoints.splice(index, 1);
    setWhatYouWillLearn(updatedPoints);
  };

  const onDropCoverImage = (acceptedFiles) => {
    setCoverImage(acceptedFiles[0]);
  };

  const {
    getRootProps: getRootCoverImageProps,
    getInputProps: getInputCoverImageProps,
  } = useDropzone({
    onDrop: onDropCoverImage,
    accept: "image/*",
  });

  useEffect(() => {
    dispatch(getAllCategoriesAction())
    setValue("name", courseToEdit?.name);
    setValue("courseSubTitle", courseToEdit?.courseSubTitle);
    setValue("instructor", courseToEdit?.instructor);
    setValue("price", courseToEdit?.price);
    setValue("category", courseToEdit?.category._id);
    setValue("level", courseToEdit?.level);
    setValue("description", courseToEdit?.description);
    setValue("link", courseToEdit?.link);
    setValue("durationDays", courseToEdit?.duration?.unit === "days" &&courseToEdit?.duration?.value );
    setValue("durationHours",courseToEdit?.duration?.unit === "hours" &&courseToEdit?.duration?.value );

    setWhatYouWillLearn(courseToEdit?.whatUWillLearn);
  }, [courseToEdit?.category._id, courseToEdit?.courseSubTitle, courseToEdit?.description, courseToEdit?.duration?.unit, courseToEdit?.duration?.value, courseToEdit?.instructor, courseToEdit?.level, courseToEdit?.link, courseToEdit?.name, courseToEdit?.price, courseToEdit?.whatUWillLearn, dispatch, id, setValue]);
  const onSubmit = (data) => {
  //   data = { ...data, whatUWillLearn: whatYouWillLearn, image: coverImage };
  if (data.coverImage === null) {
      delete data.coverImage;
    }
  // if (!coverImage) {
  //   return toast.error("Please add an image for the course");
  // }
  const { durationDays, durationHours, ...restData } = data;
const duration = { value: durationUnit === "days" ? durationDays : durationHours, unit: durationUnit };
const updatedData = { ...restData, whatUWillLearn: whatYouWillLearn, ...(coverImage !== null && { image: coverImage }), duration };

    dispatch(updateCourseByIdAction({ _id: id, courseData: updatedData }))
      .unwrap()
      .then(() => {
        toast.success("تم تعديل الدورة بنجاح");
        navigate("/admin-course");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <Container dir={i18n.dir()}>
      <Form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="mt-2 mb-2">{t('editCourse.editCourse')}</h2>
        <Row className="justify-content-start">
          <Col lg={6} md={12}>
              <Form.Group controlId="courseName" className="mb-2">
              <Form.Label>{t('addCourse.courseName')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('addCourse.courseName')}
                {...register("name", { required: true })}
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
              />
            </Form.Group>
            <Form.Group controlId="courseSubTitle" className="mb-2">
              <Form.Label>{t('addCourse.courseSubTitle')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('addCourse.courseSubTitle')}
                {...register("courseSubTitle", { required: true })}
                className={`form-control ${errors.subDescription ? "is-invalid" : ""}`}
              />
            </Form.Group>
            <Form.Group controlId="instructor" className="mb-2">
              <Form.Label> {t('editCourse.instructor')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('editCourse.instructor')}
                {...register("instructor", { required: true })}
                className={`form-control ${
                  errors.instructor ? "is-invalid" : ""
                }`}
              />
            </Form.Group>

            <Form.Group controlId="coursePrice" className="mb-2">
              <Form.Label>{t('editCourse.coursePrice')}</Form.Label>
              <Form.Control
                type="number"
                placeholder={t('editCourse.coursePrice')}
                {...register("price", { required: true })}
                className={`form-control ${errors.price ? "is-invalid" : ""}`}
              />
            </Form.Group>
            <Form.Group controlId="courseLevel" className="mb-2">
              <Form.Label>{t('addCourse.courseLevel')}</Form.Label>
              <Form.Control
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
              <Form.Label>{t('editCourse.selectCategory')}</Form.Label>
              <Form.Control
                as="select"
                name="category"
                {...register("category", { required: true })}
                className={`form-control ${
                  errors.category ? "is-invalid" : ""
                }`}
              >
                <option value="" disabled>
                {t('editCourse.selectCategory')}
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="courseDescription" className="mb-2">
              <Form.Label>{t('editCourse.courseDescription')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder={t('editCourse.courseDescription')}
                {...register("description", { required: true })}
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
              />
            </Form.Group>
          </Col>
          <Col lg={6} md={12}>
          <Form.Group controlId="courseLink" className="mb-2">
              <Form.Label>{t('addCourse.courseLink')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('addCourse.courseLink')}
                {...register("link", { required: true })}
                className={`form-control ${errors.link ? "is-invalid" : ""}`}
              />
            </Form.Group>
            <Form.Group controlId="courseDuration" className="mb-2">
              <Form.Label>{t('addCourse.selectDuration')}</Form.Label>
              <Form.Control
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

            {durationUnit && durationUnit === "days" && (
              <Form.Group controlId="courseDurationDays" className="mb-2">
                <Form.Label>{t('addCourse.courseDurationDays')}</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={t('addCourse.courseDurationDays')}
                  {...register("durationDays", { required: true })}
                  className={`form-control ${errors.durationDays ? "is-invalid" : ""}`}
                />
              </Form.Group>
            )}

            {durationUnit && durationUnit === "hours" && (
              <Form.Group controlId="courseDurationHours" className="mb-2">
                <Form.Label>{t('addCourse.courseDurationHours')}</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={t('addCourse.courseDurationHours')}
                  {...register("durationHours", { required: true })}
                  className={`form-control ${errors.durationHours ? "is-invalid" : ""}`}
                />
              </Form.Group>
            )}

            <Form.Group controlId="whatYouWillLearn" className="mb-2">
              <Form.Label>{t('editCourse.whatYouWillLearn')}</Form.Label>
              {whatYouWillLearn?.map((point, index) => (
                <div key={index} className="d-flex mb-2 gap-2">
                  <Form.Control
                    type="text"
                    placeholder={`النقطة ${index + 1}`}
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
                    {t('editCourse.removeLearnPoint')}
                  </Button>
                </div>
              ))}
              <Button
                variant="primary"
                className="mt-2"
                onClick={handleAddLearnPoint}
              >
              {t('editCourse.addLearnPoint')}
              </Button>
            </Form.Group>
            <Form.Group controlId="formCoverImage" className="mb-4">
              <Form.Label> {t('editCourse.coverImage')}</Form.Label>
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
                    className="mb-3"
                  />
                ) : (
                  <Image
                    src={coverImageUrl}
                    alt="Placeholder Image"
                    fluid
                    className="mb-3"
                  />
                )}
                <p className="text-muted small">
                {t('editCourse.dropzoneText')}
                </p>
              </div>
              {errors.coverImage && (
                <p className="text-danger mt-1">{errors.coverImage.message}</p>
              )}
            </Form.Group>
          </Col>
          <Row>
            <Col>
              <Button disabled={editCourseLoading} variant="primary" type="submit">
              {editCourseLoading ? (
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
              ):
              
              t('editCourse.editCourseButton')
              }
              </Button>
            </Col>
          </Row>
        </Row>
      </Form>
    </Container>
  );
}

export default EditCourse;
