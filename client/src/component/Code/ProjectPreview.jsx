import { useEffect, useRef, useState } from "react";
import CodePreview from "./CodePreview";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";

import { useDispatch, useSelector } from "react-redux";
import {
  createProjectAction,
  deleteProjectAction,
  getAllProjectAction,
} from "../../Redux/Action/userAction";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { t } from "i18next";

const codeSnippet = `
print("Hello, World!")

public class HelloWorld {
  public static void main(String[] args) {
      System.out.println("Hello, World!");
  }
}

#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`;
const ProjectPreview = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { createProjectLoading, projects, deleteProjectLoading } = useSelector(
    (state) => state.user
  );
  useEffect(() => {
    dispatch(getAllProjectAction(""));
  }, [dispatch]);
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const { handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (nameRef.current.value === "" || descriptionRef.current.value === "") {
      return toast.warning(
        "Please fill all the fields and select at least one file."
      );
    }
    const name = nameRef.current.value;
    const description = descriptionRef.current.value;
    data = {
      name,
      description,
      file,
    };
    dispatch(createProjectAction({ data }))
      .unwrap()
      .then(() => {
        setVisible(false);
        dispatch(getAllProjectAction(""));
      });
  };
  const [codeDialogVisible, setCodeDialogVisible] = useState(false);
  const [codeToShow, setCodeToShow] = useState("");
  const [codeHeaderToShow, setCodeHeaderToShow] = useState("");
  const handleDelete = (id) => {
    dispatch(deleteProjectAction(id))
      .unwrap()
      .then(() => {
        dispatch(getAllProjectAction(""));
        toast.success("Project deleted successfully");
      });
  };
  const LoadingOval = () => {
    return (
      <Oval
        strokeColor="white"
        strokeWidth={5}
        color="#4fa94d"
        ariaLabel="oval-loading"
        animationDuration={0.75}
        width={40}
        height={30}
        visible={true}
      />
    );
  };
  

  return (
    <Container className="mt-4">
      <Row>
        <Col xs>
          <div className="code-div d-flex justify-content-end">
            <h4 className="title1">
              <Button
                label="Show"
                icon="pi pi-external-link"
                onClick={() => setVisible(true)}
              >
                {t("projectpreview.addnewproject")}
              </Button>
            </h4>
          </div>
        </Col>
      </Row>
      <div className="card flex justify-content-center">
        <Dialog
          header="Add New Project"
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => setVisible(false)}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card flex justify-content-center mt-2">
              <label htmlFor="name" className="label font-bold block mb-1">
                Name
              </label>
              <InputText required id="name" ref={nameRef} />
            </div>
            <div className="card flex justify-content-center mt-2">
              <label
                htmlFor="description"
                className="label font-bold block mb-1"
              >
                Description
              </label>
              <InputTextarea
                required
                id="description"
                ref={descriptionRef}
                rows={5}
                cols={30}
              />
            </div>
            <div>
              <input
                type="file"
                accept=".json, .jsx, .tsx"
                multiple
                disabled={file}
                onChange={handleFileChange}
              />
              <h5 className="card-code-title mt-2">Selected Files:</h5>
              <ul className="list-group">
                {file && (
                  <li
                    key={file.name}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {file.name}
                    <button
                      className="btn btn-danger"
                      onClick={() => setFile(null)}
                    >
                      Remove
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <Button
              type="submit"
              disabled={createProjectLoading}
              variant="primary"
              className="mt-4"
            >
              {createProjectLoading ? <LoadingOval /> : "Submit"}
            </Button>
          </form>
        </Dialog>
      </div>
      <CodePreview codeString={codeSnippet} language="javascript" />
      <Row>
        <Col xs>
          <h3 className="card-code-title"> {t("projectpreview.showcode")}</h3>
          {projects && projects.length > 0 ? (
            <div className="project__cards d-flex gap-4">
              {projects.map((project, index) => (
                <div
                  style={{
                    border: "1px solid #dd2476",
                    color: "rgba(250, 250, 250, 0.8)",
                    width: "18rem",
                    background: "#222",
                  }}
                  id="card-code"
                  className="card"
                  key={index}
                >
                  <div className="card-body">
                    <h5 className="card-title">{project.name}</h5>
                    <hr />
                    <p className="card-text">{project.description}</p>
                  </div>
                  <div className="card-footer gap-2">
                    <Button
                      label="Show"
                      icon="pi pi-external-link"
                      onClick={() => {
                        setCodeDialogVisible(true);
                        setCodeToShow(project.code);
                        setCodeHeaderToShow(project.name);
                      }}
                    >
                      show
                    </Button>
                    <Button
                      className="btn btn-danger"
                      disabled={deleteProjectLoading}
                      onClick={() => handleDelete(project._id)}
                    >
                    Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-2">{t("projectpreview.add code to show it")}</p>
          )}
        </Col>
      </Row>

      <Dialog
        header={codeHeaderToShow}
        visible={codeDialogVisible}
        style={{ width: "50vw", marginTop: "4rem" }}
        onHide={() => setCodeDialogVisible(false)}
      >
        <CodePreview codeString={codeToShow} language="javascript" />
      </Dialog>
    </Container>
  );
};

export default ProjectPreview;
