import { useEffect, useRef, useState } from "react";

import { FaEdit } from "react-icons/fa";

import { Button } from "react-bootstrap";
import UserProfileImage from "../images/user.png";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  followUserAction,
  getSuggestionsAction,
  updateUserProfileAction,
  userProfileAction,
} from "../Redux/Action/userAction";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { t } from "i18next";
import BookCard from "./Books/bookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Oval } from "react-loader-spinner";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
const Profile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { currentUser, followUserLoading } = useSelector((state) => state.user);
  const { getUser: userData, suggestions } = useSelector((state) => state.user);
  const { profileImage: userImage } = userData || {};

  const [profileImage, setProfileImage] = useState(userImage?.url);
  useEffect(() => {
    dispatch(userProfileAction(userId));
    dispatch(getSuggestionsAction());
    setProfileImage( userImage?.url);
  }, [dispatch, userId, userImage?.url]);
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const firstNameRef = useRef(null);
  const bioRef = useRef(null);
  const skillsRef = useRef(null);
  const [selectedSkills, setSelectedSkills] = useState(null);
  const skills = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];
  const background = {
    background:
      "radial-gradient(circle, rgba(245,183,67,1) 0%, rgba(8,8,154,1) 100%)",
    position: "relative",
    width: "100%",
    minHeight: "30vh",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  };
  const handleEditProfileImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFile(file);
        setProfileImage(URL.createObjectURL(file));
      };
    });
    input.click();
  };

  const handleEditProfileInfo = () => {
    setEditMode(true);
  };

  const handleSaveProfileInfo = () => {
    setEditMode(false);
    const firstName = firstNameRef.current.value;
    const email = emailRef.current.value;
    const bio = bioRef.current.value;
    const lastName = lastNameRef.current.value;
    const skills = selectedSkills?.map((skill) => skill.name);
    let data;
    if (profileImage) {
      data = { email, skills, bio, firstName, lastName, image: file };
    } else {
      data = { email, skills, bio, firstName, lastName };
    }
    console.log(data);
    dispatch(updateUserProfileAction({ userData: data }))
      .unwrap()
      .then(() => {
        toast.success("Your profile has been updated");
        dispatch(userProfileAction(userId));
      });
  };
  const [followersCount, setFollowersCount] = useState(0);
  const [disableFollow, setDisableFollow] = useState(false);

  useEffect(() => {
    const already = currentUser?.following?.includes(userId);
    const followersCount = currentUser?.following.length;
    setDisableFollow(already);
    setFollowersCount(followersCount);
  }, [currentUser?.following, userId]);

  const followUserProfile = (userId) => {
    dispatch(followUserAction(userId))
      .unwrap()
      .then(() => {
        if (disableFollow) {
          setDisableFollow(false);
          setFollowersCount((prevCount) => prevCount - 1);
        } else {
          setDisableFollow(true);
          setFollowersCount((prevCount) => prevCount + 1);
        }
      });
  };
  const navigate = useNavigate();
  return (
    <div
      dir="ltr"
      className="container"
      style={{
        padding: 0,
        marginTop: "3rem",
        borderRadius: "8px",
        width: "100%",
        background: "#f4f4f4",
        minHeight: "80vh",
      }}
    >
      <div className="container-profile" style={background}>
        <div className="profile__actions">
          {userId === currentUser?._id &&
            (editMode ? (
              <Button variant="primary" onClick={handleSaveProfileInfo}>
                Save
              </Button>
            ) : (
              <Button variant="secondary" onClick={handleEditProfileInfo}>
                Edit
              </Button>
            ))}

          <div className="follow-btns d-flex gap-2">
            {userId !== currentUser?._id ? (
              <>
                <Button disabled variant="primary" className="btn primary">
                  Followers ({followersCount})
                </Button>
                {disableFollow ? (
                  <Button
                    onClick={() => followUserProfile(userId)}
                    variant="primary"
                    className="btn primary"
                  >
                    {followUserLoading ? (
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
                    ) : (
                      "unFollow"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => followUserProfile(userId)}
                    variant="primary"
                    className="btn primary"
                  >
                    {followUserLoading ? (
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
                    ) : (
                      "Follow"
                    )}
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button disabled variant="primary" className="btn primary">
                  Followers ({currentUser?.followers?.length})
                </Button>
                <Button disabled variant="light" className="btn primary">
                  Following ({currentUser?.following?.length})
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="profile__image">
          <img
            className="profile__image-image"
            loading="lazy"
            src={profileImage}
            alt=""
            style={{
              boxShadow: "rgba(0, 0, 0, 0.49) 0px 10px 7px 0px",
              objectFit: "fill",
            }}
          />
          {/* <div>
           
          </div> */}
          {editMode && (
            <div
              className="profile__image-edit"
              onClick={handleEditProfileImage}
            >
              <FaEdit style={{ color: "#9e9ea7" }} />
            </div>
          )}
        </div>
        <div className="profile__info">
          <span className="p-float-label d-flex gap-2">
            <InputText
              disabled={!editMode}
              id="username"
              style={{ width: "50%" }}
              ref={firstNameRef}
              defaultValue={userData?.firstName}
            />
            <InputText
              style={{ width: "50%" }}
              disabled={!editMode}
              id="lastName"
              ref={lastNameRef}
              defaultValue={userData?.lastName}
            />
          </span>
          <span className="mt-2">
            <InputText
              disabled={!editMode}
              id="email"
              style={{ width: "100%" }}
              ref={emailRef}
              defaultValue={userData?.email}
            />
          </span>
          <div className="card p-fluid mt-2">
            <MultiSelect
              filter
              disabled={!editMode}
              value={selectedSkills}
              ref={skillsRef}
              defaultValue={userData?.skills}
              onChange={(e) => setSelectedSkills(e.value)}
              options={skills}
              placeholder="Skills"
              optionLabel="name"
            />
          </div>
          <div className="card flex justify-content-center mt-2">
            <InputTextarea
              disabled={!editMode}
              defaultValue={userData?.bio}
              ref={bioRef}
              rows={5}
              cols={30}
            />
          </div>
        </div>
      </div>
      <div
        style={{ marginTop: "18rem", padding: "1rem", paddingBottom: "2rem" }}
      >
        <span className="p-2"> Your Wishlist</span>
        <div>
          <h2 className="mb-4 mx-2">Courses</h2>
          <div className="slider-container px-2" style={{ overflow: "hidden" }}>
            {userData?.courseWishlist?.length > 0 ? (
              <Swiper spaceBetween={50} slidesPerView={3}>
                {userData?.courseWishlist?.map((course) => (
                  <SwiperSlide key={course._id}>
                    <div className="course-card" style={{ margin: ".5rem" }}>
                      <Link to={`/course-details/${course._id}`}>
                        {course.image ? (
                          <img
                            className="img3"
                            style={{ width: "90%" }}
                            src={`${course.image.url}`}
                            alt={`course-${course._id}`}
                          />
                        ) : (
                          <div className="placeholder-image">
                            Placeholder Image
                          </div>
                        )}
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="no-courses-message">
                {t("bestCoursesPage.noCoursesMessage")}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 profile__books">
          <h2 className="mb-4 mx-2">Books</h2>
          {userData?.bookWishlist?.length > 0 ? (
            <Swiper spaceBetween={50} slidesPerView={3}>
              {userData?.bookWishlist?.map((book, index) => (
                <SwiperSlide key={index}>
                  <BookCard book={book} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="px-2">There no Books to display</p>
          )}
        </div>
      </div>
      <hr />
      {currentUser._id === userId && (
        <>
          <div style={{ padding: "1rem" }}>
            <h2 className="mb-4 mx-2">Suggestions</h2>
            <div>
              {suggestions?.books?.length > 0 ? (
                <>
                  <h4>books</h4>
                  <Swiper spaceBetween={50} slidesPerView={3}>
                    {suggestions.books.map((book, index) => (
                      <SwiperSlide key={index}>
                        <BookCard book={book} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </>
              ) : (
                <p className="px-2">There no suggested Books to display</p>
              )}
            </div>

            <div>
              {suggestions?.users?.length > 0 ? (
                <>
                  <h4>Users To Follow</h4>
                  <Swiper spaceBetween={50} slidesPerView={3}>
                    {suggestions.users.map((user, index) => (
                      <SwiperSlide key={index}>
                        <div
                          className="card text-center"
                          style={{ width: "18rem" }}
                        >
                          <div className="py-4 p-2">
                            <div>
                              <img
                                src={`${user.profileImage.url}`}
                                className="rounded"
                                width="100"
                              />
                            </div>
                            <div className="mt-3 d-flex flex-row justify-content-center">
                              <h5>
                                {user.firstName}
                                {user.lastName}
                              </h5>
                              <span className="dots">
                                <i className="fa fa-check"></i>
                              </span>
                            </div>

                            <div className="mt-3 gap-2">
                              <button className="btn btn-danger ml-2 mx-2">
                                Follow
                              </button>
                              <button
                                onClick={() => navigate(`/profile/${user._id}`)}
                                className="btn btn-outline-secondary ml-2 mr-2"
                              >
                                View profile
                              </button>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </>
              ) : (
                <p className="px-2">There no suggested Users to display</p>
              )}
            </div>
            <div className="mt-2">
              {suggestions?.courses?.length > 0 ? (
                <>
                  <h4>Courses</h4>
                  <Swiper spaceBetween={50} slidesPerView={3}>
                    {suggestions.courses.map((course, index) => (
                      <SwiperSlide key={index}>
                        <div
                          className="course-card"
                          style={{ margin: ".5rem" }}
                        >
                          <Link to={`/course-details/${course._id}`}>
                            {course.image ? (
                              <img
                                className="img3"
                                style={{ width: "90%" }}
                                src={`${course.image.url}`}
                                alt={`course-${course._id}`}
                              />
                            ) : (
                              <div className="placeholder-image">
                                Placeholder Image
                              </div>
                            )}
                          </Link>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </>
              ) : (
                <p className="px-2">There no suggested Courses to display</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
