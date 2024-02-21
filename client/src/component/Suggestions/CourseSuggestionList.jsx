import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteCourseByIdAction,
  getCoursesSuggestions,
} from "../../Redux/Action/courseAction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";
import { Oval } from "react-loader-spinner";
import i18n from "../../i18n";

export const CourseSuggestionList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {suggestions: courses, deleteLoading } = useSelector((state) => state.course);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    dispatch(getCoursesSuggestions());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleEdit = (courseId) => {
    navigate(`/preview-course/${courseId}`);
  };

  const formatLastUpdate = (updatedAt) => {
    const date = new Date(updatedAt);

    // Format date
    const optionsDate = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("ar-EG", optionsDate).format(
      date
    );

    // Format time
    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
    };
    const formattedTime = new Intl.DateTimeFormat("ar-EG", optionsTime).format(
      date
    );

    return `  ${t("courseTable.lastUpdateOn")} ${formattedDate} ${t(
      "courseTable.at"
    )} ${formattedTime}`;
  };

  const formattedCourses = courses?.map((course) => ({
    ...course,
    formattedUpdatedAt: formatLastUpdate(course.updatedAt),
  }));

  const actionBodyTemplate = (course) => {
    return (
      <span className="d-flex justify-content-center align-items-center gap-2 p-4">
        <Button
          onClick={() => handleEdit(course._id)}
          variant="info"
          size="md"
          className="pr-2"
        >
          {t("Suggest.show")}
        </Button>
      </span>
    );
  };

  return (
    <Container className="mt-4">
      <Row>
      <h2 dir={i18n.dir()}>{t('Suggest.ManageSuggestedCourses')}</h2>
        <Col>
          <div
            className="card p-fluid"
            style={{ borderRadius: "15px", backgroundColor: "#fff" }}
          >
            <DataTable
              value={formattedCourses}
              dataKey="_id"
              size="small"
              stripedRows
              tableStyle={{ minWidth: "50rem" }}
              rowHover
              style={{ fontSize: "18px", padding: "10px" }}
              sortField="createdAt"
              sortOrder={-1}
              paginator
              rows={10}
            >
              <Column
                headerStyle={{ padding: "1rem" }}
                style={{
                  width: "25%",
                  marginBottom: "2em",
                  textAlign: "right",
                }}
                field="name"
                header={t("courseTable.courseTitle")}
              ></Column>
              <Column
                style={{ width: "25%", textAlign: "right" }}
                field="instructor"
                header={t("courseTable.instructor")}
              ></Column>
              <Column
                style={{ width: "25%", textAlign: "right" }}
                field="category.categoryName"
                header={t("courseTable.category")}
              ></Column>
              <Column
                style={{ width: "25%", textAlign: "right" }}
                field="formattedUpdatedAt"
                header={t("courseTable.lastUpdate")}
                sortable
              ></Column>

              <Column
                style={{ width: "25%", textAlign: "right" }}
                header={t("courseTable.actions")}
                body={actionBodyTemplate}
                headerStyle={{ textAlign: "center", minWidth: "8rem" }}
              />
            </DataTable>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
