// NPM Packages
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useEffect } from "react";

// Project files
import { PostCard } from "../../../components/post/postCard";
import { PostForm } from "../../../components/post/PostForm";
import {
	postDataState,
} from "../../../state/userDataState";

export const Discussion = ({ groupData }) => {
	// State
	const [postData, setPostData] = useRecoilState(postDataState);
	let { id } = useParams();
	// Constants

	// Components
	useEffect(() => {
		let mount = true;
		if (mount) {
			groupData.map((group) => setPostData(group.posts));
		}
		return () => {
			mount = false;
		};
	}, [setPostData]);

	return (
		<div>
			<h1>Discussion</h1>
			<PostForm groupId={id} />
			{postData.map((post) => {
				return <PostCard key={post.id} data={post} />;
			})}
		</div>
	);
};
