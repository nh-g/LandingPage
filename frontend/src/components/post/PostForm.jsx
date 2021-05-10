// NPM Packages
import { useState, useEffect } from "react";

// Project files
import PostApi from "../../api/PostsApi";
import { ImageUploader } from "../ImageUploader";

export const PostForm = ({ groupId, onSubmit }) => {
	// State

	const [photoUrl, setPhotoUrl] = useState("");
	const [postForm, setPostForm] = useState({
		body: "",
		photo: "",
	});
	// Constants
	async function createPost(requestBody) {
		try {
			await PostApi.createPost(groupId, requestBody).then((res) =>
				onSubmit(res.data)
			);
		} catch (e) {
			console.error(e);
		}
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPostForm({
			...postForm,
			[name]: value,
		});
		console.log(postForm);
		console.log(photoUrl);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost(postForm);
		setPostForm({ body: "", photo: "" });
	};

	const handleDiscard = (e) => {
		e.preventDefault();
		setPhotoUrl("");
	};

	useEffect(() => {
		setPostForm({ ...postForm, photo: photoUrl });
	}, [photoUrl]);

	// Components

	return (
		<form onSubmit={handleSubmit}>
			{postForm.photo !== "" && (
				<>
					<img
						className="groupForm--avatar"
						src={postForm.photo}
						alt="User Avatar"
					/>

					<button onClick={handleDiscard}>discard image</button>
				</>
			)}
			<textarea
				value={postForm.body}
				onChange={handleChange}
				placeholder="what's on your mind..."
				type="text"
				name="body"
				required
				maxLength="255"
			/>

			<button type="submit">Submit</button>
			<ImageUploader setImageState={setPhotoUrl} />
		</form>
	);
};
