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

const composeValidators = (...validators) => (value) =>
	validators.reduce((error, validator) => error || validator(value), undefined);
const focusOnError = createDecorator();

export const GroupEdit = (props) => {
	const { groupData } = props.location.state.fromNotifications;

	const history = useHistory();

	const mapTopics = groupData.topics.flatMap((topic) => {
		const topicNumber = [];

		switch (topic.toLowerCase()) {
			case "sport":
				topicNumber.push("1");
				break;
			case "entertainment":
				topicNumber.push("2");
				break;
			case "health":
				topicNumber.push("3");
				break;
			case "education":
				topicNumber.push("4");
				break;
			case "family":
				topicNumber.push("5");
				break;

			default:
				break;
		}
		return topicNumber;
	});

	//   State

	const [topicArray, setTopicArray] = useState(mapTopics);

	const [checked, setChecked] = useState({
		sport: groupData.topics.includes("Sport"),
		entertainment: groupData.topics.includes("Entertainment"),
		health: groupData.topics.includes("Health"),
		education: groupData.topics.includes("Education"),
		family: groupData.topics.includes("Family"),
	});

	const [imageUrl, setImageUrl] = useState(groupData.avatar);

	const [, setUserData] = useRecoilState(userDataState);

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

			await GroupApi.updateGroup(groupData.id, values).then((res) => res.data);

			for (const topic of mapTopics) {
				await GroupApi.unjoinTopic(groupData.id, topic);
			}

			for (const topic of topicArray) {
				await GroupApi.joinTopic(groupData.id, topic);
			}

			await UserApi.getUser().then(({ data }) => setUserData(data));
		} catch (e) {
			console.error(e);
		}
	};

	// Constants

	const groupNameExists = async (value) => {
		if (value === groupData.title) {
			return;
		}
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
					<h2>Edit Group</h2>
					<Field
						className="input-field"
						name="title"
						defaultValue={groupData.title}
						placeholder="Group Name"
						validate={composeValidators(required, groupNameExists)}
					>
						{({ input, meta, placeholder }) => (
							<div
								className={`field ${
									meta.active ? "active input-field" : "input-field"
								}`}
							>
								<i className="fas fa-user"></i>
								<input {...input} placeholder={placeholder} />
								{meta.error && meta.touched && (
									<div className="input-field-error">{meta.error}</div>
								)}
							</div>
						)}
					</Field>
					<Field
						className="input-field"
						defaultValue={groupData.description}
						name="description"
						placeholder="Group Description"
						validate={composeValidators(required)}
					>
						{({ input, meta, placeholder }) => (
							<div
								className={`field ${
									meta.active ? "active input-field" : "input-field"
								}`}
							>
								<i className="fas fa-envelope"></i>
								<textarea {...input} placeholder={placeholder} />
								{meta.error && meta.touched && (
									<div className="input-field-error">{meta.error}</div>
								)}
							</div>
						)}
					</Field>
					<Field
						defaultValue={groupData.rules}
						className="input-field"
						name="rules"
						placeholder="Group Rules"
					>
						{({ input, meta, placeholder }) => (
							<div
								className={`field ${
									meta.active ? "active input-field" : "input-field"
								}`}
							>
								<i className="fas fa-lock"></i>
								<textarea
									{...input}
									placeholder={placeholder}
									type="textarea"
								/>
								{meta.error && meta.touched && (
									<div className="input-field-error">{meta.error}</div>
								)}
							</div>
						)}
					</Field>
					<label htmlFor="sport">Sport</label>
					<Field
						onClick={onCheck}
						onChange={() => {
							setChecked({ ...checked, sport: !checked.sport });
						}}
						checked={checked.sport}
						id="sport"
						name="sport"
						component="input"
						value="1"
						type="checkbox"
					/>
					<label htmlFor="Entertainment">Entertainment</label>
					<Field
						onChange={() => {
							setChecked({ ...checked, entertainment: !checked.entertainment });
						}}
						checked={checked.entertainment}
						onClick={onCheck}
						id="Entertainment"
						name="entertainment"
						component="input"
						type="checkbox"
						value="2"
					/>
					<label htmlFor="health">Health</label>
					<Field
						onChange={() => {
							setChecked({ ...checked, health: !checked.health });
						}}
						checked={checked.health}
						onClick={onCheck}
						id="health"
						name="health"
						component="input"
						value="3"
						type="checkbox"
					/>
					<label htmlFor="Education">Education</label>
					<Field
						onChange={() => {
							setChecked({ ...checked, education: !checked.education });
						}}
						checked={checked.education}
						onClick={onCheck}
						id="Education"
						name="education"
						component="input"
						value="4"
						type="checkbox"
					/>
					<label htmlFor="Family">Family</label>
					<Field
						onChange={() => {
							setChecked({ ...checked, family: !checked.family });
						}}
						checked={checked.family}
						onClick={onCheck}
						id="Family"
						name="family"
						component="input"
						value="5"
						type="checkbox"
					/>
					<ImageUploader setImageState={setImageUrl} />
					<img src={imageUrl} alt="User Avatar" />
					<input
						className="btn"
						value="Create"
						type="submit"
						disabled={pristine || submitting}
					/>
					<FormSpy subscription={{ submitSucceeded: true, values: true }}>
						{({ submitSucceeded }) => {
							if (submitSucceeded) {
								history.push(`/groups/${groupData.id}/home`);
								return <Link to="/" />;
							}
							return <div></div>;
						}}
					</FormSpy>
					            
				</form>
			)}
		</Form>
	);
};
