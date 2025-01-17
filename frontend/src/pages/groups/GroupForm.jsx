// NPM Packages
import { useState } from "react";
import { useRecoilState } from "recoil";
import { Form, Field, FormSpy } from "react-final-form";
import createDecorator from "final-form-focus";
import { Link, useHistory } from "react-router-dom";

// Project files
import { userDataState } from "../../state/userDataState";
import GroupApi from "../../api/GroupApi";
import UserApi from "../../api/UserApi";
import { ImageUploader } from "../../components/ImageUploader";

const composeValidators =
  (...validators) =>
  (value) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );
const focusOnError = createDecorator();

export const GroupForm = () => {
  //   State

  const [topicArray, setTopicArray] = useState([]);

  const [imageUrl, setImageUrl] = useState(
    "https://res.cloudinary.com/dlvwrtpzq/image/upload/v1619987659/profilePhotos/placeholder_eo6jkp.png"
  );

  const history = useHistory();

  const [, setUserData] = useRecoilState(userDataState);
  const [group, setGroup] = useState({});

  const onCheck = (event) => {
    const indexTopic = topicArray.indexOf(event.target.value);
    const filterValue = topicArray[indexTopic];
    if (indexTopic >= 0) {
      const deleteTopic = topicArray.filter((item) => item !== filterValue);
      setTopicArray(deleteTopic);
    } else {
      setTopicArray([...topicArray, event.target.value]);
    }
  };

  const onSubmit = async (values) => {
    try {
      values.avatar = imageUrl;

      const group = await GroupApi.createGroup(values).then((res) => res.data);

      setGroup(group);

      for (const topic of topicArray) {
        await GroupApi.joinTopic(group.id, topic);
      }

      await UserApi.getUser().then(({ data }) => setUserData(data));
    } catch (e) {
      console.error(e);
    }
  };

  // Constants

  const groupNameExists = async (value) => {
    const exists = await GroupApi.checkGroupTitle(value)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (exists) {
      return "Group Name already exists";
    }
  };

  const required = (value) => (value ? undefined : "Required");

  // Components

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        decorators={[focusOnError]}
        subscription={{
          submitting: true,
        }}
      >
        {({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={(event) => {
              const promise = handleSubmit(event);
              if (promise === undefined) {
              } else {
                promise.then(() => {
                  form.reset();
                });
              }

              return promise;
            }}
          >
            <h2>Create Group</h2>
            <Field
              name="title"
              placeholder="Group Name"
              validate={composeValidators(required, groupNameExists)}
            >
              {({ input, meta, placeholder }) => (
                <div className="form--input">
                  <input required {...input} placeholder={placeholder} />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  {meta.error && meta.touched && (
                    <div className="error">{meta.error}</div>
                  )}
                  <label>Group Name</label>
                </div>
              )}
            </Field>
            <Field
              placeholder="Group Description"
              name="description"
              validate={composeValidators(required)}
            >
              {({ input, meta, placeholder }) => (
                <div className="form--input">
                  <textarea
                    required
                    {...input}
                    rows="5"
                    placeholder={placeholder}
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  {meta.error && meta.touched && (
                    <div className="error">{meta.error}</div>
                  )}
                  <label>Group Description</label>
                </div>
              )}
            </Field>
            <Field placeholder="Group Rules" name="rules">
              {({ input, meta, placeholder }) => (
                <div className="form--input">
                  <textarea
                    {...input}
                    type="textarea"
                    rows="5"
                    placeholder={placeholder}
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  {meta.error && meta.touched && (
                    <div className="error">{meta.error}</div>
                  )}
                  <label>Group Rules</label>
                </div>
              )}
            </Field>
            <h2>Set Topics</h2>
            <ul className="ks-cboxtags">
              <li>
                <div>
                  <Field
                    onClick={onCheck}
                    id="Sport"
                    name="Sport"
                    component="input"
                    value="1"
                    type="checkbox"
                  />
                  <label htmlFor="Sport">Sport</label>
                </div>
              </li>
              <li>
                <div>
                  <Field
                    onClick={onCheck}
                    id="Entertainment"
                    name="Entertainment"
                    component="input"
                    value="2"
                    type="checkbox"
                  />
                  <label htmlFor="Entertainment">Entertainment</label>
                </div>
              </li>
              <li>
                <div>
                  <Field
                    onClick={onCheck}
                    id="Health"
                    name="Health"
                    component="input"
                    value="3"
                    type="checkbox"
                  />
                  <label htmlFor="Health">Health</label>
                </div>
              </li>
              <li>
                <div>
                  <Field
                    onClick={onCheck}
                    id="Education"
                    name="Education"
                    component="input"
                    value="4"
                    type="checkbox"
                  />
                  <label htmlFor="Education">Education</label>
                </div>
              </li>
              <li>
                <div>
                  <Field
                    onClick={onCheck}
                    id="Family"
                    name="Family"
                    component="input"
                    value="5"
                    type="checkbox"
                  />
                  <label htmlFor="Family">Family</label>
                </div>
              </li>
            </ul>
            <div className="groupForm--upload">
              <ImageUploader setImageState={setImageUrl} />
            </div>
            <div className="groupForm--img">
              <img
                className="groupForm--avatar"
                src={imageUrl}
                alt="User Avatar"
              />
            </div>
            <input
              className="btn"
              value="Create"
              type="submit"
              disabled={pristine || submitting}
            />
            <FormSpy subscription={{ submitSucceeded: true, values: true }}>
              {({ submitSucceeded }) => {
                if (submitSucceeded) {
                  history.push(`/groups/${group.id}/home`);
                  return <Link to="/" />;
                }
                return <div></div>;
              }}
            </FormSpy>
                        
          </form>
        )}
      </Form>
    </div>
  );
};
