import { useContext } from "react";
import { Link } from "react-router-dom";
import { Form, Formik, Field, ErrorMessage } from "formik";

import { contactSchema } from "../../validations/contactValidation";
import { contactContext } from "../../context/contactContext";
import { Spinner } from "../";
import { COMMENT, GREEN, PURPLE } from "../../helpers/colors";

const AddContact = () => {
  const { loading, contact, onContactChange, groups, createContact } =
    useContext(contactContext);

  
    
  

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <section className="p-3">
            <img
              src={require("../../assets/man-taking-note.png")}
              height="400px"
              style={{
                position: "absolute",
                zIndex: "-1",
                top: "130px",
                left: "100px",
                opacity: "50%",
              }}
            />
            <div className="container">
              <div className="row">
                <div className="col">
                  <p
                    className="h4 fw-bold text-center"
                    style={{ color: GREEN }}
                  >
                    ساخت مخاطب جدید
                  </p>
                </div>
              </div>
              <hr style={{ backgroundColor: GREEN }} />
              <div className="row mt-5">
                <div className="col-md-4">
                  {/* {errors?.map((error, index) => ( */}
                  {/*   <p key={index} className="text-danger"> */}
                  {/*     {error.message} */}
                  {/*   </p> */}
                  {/* ))} */}
                  <Formik
                    initialValues= {{
                      fullname: "",
                      photo: "",
                      mobile: "",
                      email: "",
                      job: "",
                      group: "",
                    }}
                    validationSchema= {contactSchema}
                    onSubmit= {(values) => {
                      console.log(values);
                      createContact(values);
                    }}
                  >
                    {
                      
                      <Form>
                        <div className="mb-2">
                          <Field
                            id="fullname"
                            name="fullname"
                            type="text"
                            className="form-control"
                            placeholder="نام و نام خانوادگی"
                            /* required={true} */
                          />
                          <ErrorMessage name="fullname" />
                        </div>

                        <div className="mb-2">
                          <Field
                            id="photo"
                            name="photo"
                            type="text"
                            className="form-control"
                            /* required={true} */
                            placeholder="آدرس تصویر"
                          />

                          <ErrorMessage name="photo"/>
                        </div>
                        <div className="mb-2">
                          <Field
                            id="mobile"
                            name="mobile"
                            type="number"
                            className="form-control"
                            /* required={true} */
                            placeholder="شماره موبایل"
                          />

                          <ErrorMessage name="mobile" />
                        </div>
                        <div className="mb-2">
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            /* required={true} */
                            placeholder="آدرس ایمیل"
                          />
                          <ErrorMessage name="email" />
                        </div>
                        <div className="mb-2">
                          <Field
                            id="job"
                            name="job"
                            type="text"
                            className="form-control"
                            /* required={true} */
                            placeholder="شغل"
                          />

                          <ErrorMessage name="job"/>
                        </div>
                        <div className="mb-2">
                          <Field
                            id="group"
                            name="group"
                            as="select"
                            /* required={true} */
                            className="form-control"
                          >
                            <option value="">انتخاب گروه</option>
                            {groups.length > 0 &&
                              groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                  {group.name}
                                </option>
                              ))}
                          </Field>

                          <ErrorMessage name="group" />
                        </div>
                        <div className="mx-2">
                          <input
                            type="submit"
                            className="btn"
                            style={{ backgroundColor: PURPLE }}
                            value="ساخت مخاطب"
                          />
                          <Link
                            to={"/contacts"}
                            className="btn mx-2"
                            style={{ backgroundColor: COMMENT }}
                          >
                            انصراف
                          </Link>
                        </div>
                      </Form>
                    }
                  </Formik>
                  
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default AddContact;
