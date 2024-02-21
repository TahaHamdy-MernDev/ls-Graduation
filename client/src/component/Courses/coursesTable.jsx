import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteCourseByIdAction,
  fetchCoursesAction,
} from "../../Redux/Action/courseAction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";
import { Oval } from "react-loader-spinner";

function CourseTable() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { courses, deleteLoading } = useSelector((state) => state.course);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCoursesAction());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleEdit = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleShowModal = (courseId) => {
    setCourseToDelete(courseId);
    setShowConfirmModal(true);
  };

  const handleHideModal = () => {
    setShowConfirmModal(false);
    setCourseToDelete(null);
  };

  const handleDeleteCourse = () => {
    if (courseToDelete) {
      dispatch(deleteCourseByIdAction(courseToDelete))
        .unwrap()
        .then(() => {
          toast.success(t('courseTable.courseDeletedSuccessfully'));
          setCourseToDelete(null);
          setShowConfirmModal(false);
          dispatch(fetchCoursesAction());
        })
        .then((err) => {
          toast.error(err.message);
        });
    }
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

    return `  ${t('courseTable.lastUpdateOn')} ${formattedDate} ${t('courseTable.at')} ${formattedTime}`;
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
          {t('courseTable.edit')}
        </Button>
        <Button variant="danger" size="md" onClick={() => handleShowModal(course._id)}>
          {t('courseTable.delete')}
        </Button>
      </span>
    );
  };

  return (
    <div
      className="card p-fluid"
      style={{ borderRadius: "15px", backgroundColor: "#fff" }}
    >
      <DataTable
        // showGridlines 
        value={formattedCourses}
        dataKey="_id"
        size="small"
        stripedRows
        tableStyle={{ minWidth: "50rem" }}
        rowHover
        style={{ fontSize: "18px", }}
        sortField="createdAt"
        sortOrder={-1}
        paginator
        rows={10}
      >
        <Column
          headerStyle={{ padding: '1rem' }}
          style={{ width: "25%", marginBottom: "2em", textAlign: "right" }}
          field="name"
          header={t('courseTable.courseTitle')}
        ></Column>
        <Column
          style={{ width: "25%", textAlign: "right" }}
          field="instructor"
          header={t('courseTable.instructor')}
        ></Column>
        <Column
          style={{ width: "25%", textAlign: "right" }}
          field="category.categoryName"
          header={t('courseTable.category')}
        ></Column>
        <Column
          style={{ width: "25%", textAlign: "right" }}
          field="formattedUpdatedAt"
          header={t('courseTable.lastUpdate')}
          sortable
        ></Column>

        <Column
          style={{ width: "25%", textAlign: "right" }}
          header={t('courseTable.actions')}
          body={actionBodyTemplate}
          headerStyle={{ textAlign: "center", minWidth: "8rem" }}
        />
      </DataTable>
      <Modal show={showConfirmModal} onHide={handleHideModal} centered>
        <Modal.Header>
          <Modal.Title>{t('courseTable.confirmDeletion')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('courseTable.confirmDeletionMessage')}</Modal.Body>
        <Modal.Footer className="justify-content-start">
          {deleteLoading ? (
            <Button disabled={deleteLoading} variant="danger" onClick={handleDeleteCourse}>
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
            </Button>
          ) : (
            <>
              <Button variant="danger" onClick={handleDeleteCourse}>
                {t('courseTable.delete')}
              </Button>
              <Button variant="secondary" onClick={handleHideModal}>
                {t('courseTable.cancel')}
              </Button>
            </>
          )

          }


        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CourseTable;
