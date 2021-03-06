import {
	FC,
	memo,
	useCallback,
	useContext,
	useEffect,
	useReducer,
	useState,
} from "react";
import { Box, Grid } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllPosts } from "utils/api/post";
import { transformDateTime, transformPlace } from "utils/transformForRead";
import { postsInit, postsReducer } from "reducers/posts";
import { CardSkeleton } from "components/atoms/CardSkeleton";
import { HomeTabs } from "components/molucules/posts/HomeTabs";
import { MapContext } from "providers/MapProvider";
import { calculateDistance } from "utils/calculateDistance";
import { Post } from "types";
import { AuthContext } from "providers/AuthProvider";
import { PostCard } from "components/organisms/posts/PostCard";
import { SearchByDateTime } from "components/molucules/posts/SearchByDateTime";

export const Home: FC = memo(() => {
	const [state, dispatch] = useReducer(postsReducer, postsInit);
	const { lat, lng } = useContext(MapContext);
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();
	const [dateTimeInputValue, setDateTimeInputValue] = useState<Date | null>(
		null
	);

	const onClickProfile = (id: number) => {
		navigate(`/users/${id}`);
	};

	const onClickPost = (id: number) => {
		navigate(`/posts/${id}`);
	};

	const sortPostsByDistance = useCallback(
		(posts: Post[]) =>
			posts.sort(
				(a, b) =>
					calculateDistance(lat, lng, a.lat, a.lng) -
					calculateDistance(lat, lng, b.lat, b.lng)
			),
		[lat, lng]
	);

	const handleGetAllPosts = async () => {
		try {
			await getAllPosts(false).then((res) => {
				dispatch({
					type: "FETCH_SUCCESS",
					payload:
						location.pathname === "/circumference"
							? sortPostsByDistance([...res.data])
							: res.data,
				});
			});
		} catch (e) {
			console.error(e);
		}
	};

	const handleSearchPosts = () => {
		const PostsSortedByDateTime = [...state.posts].filter((post) => {
			return dateTimeInputValue! < new Date(post.dateTime);
		});
		dispatch({
			type: "FETCH_SUCCESS",
			payload: PostsSortedByDateTime,
		});
	};

	useEffect(() => {
		dispatch({ type: "FETCHING" });
		handleGetAllPosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	return (
		<Box
			sx={{
				width: {
					xs: "300px",
					sm: "400px",
					md: "500px",
					lg: "600px",
					xl: "650px",
				},
				p: 1,
			}}
		>
			<SearchByDateTime
				dateTimeInputValue={dateTimeInputValue}
				setDateTimeInputValue={setDateTimeInputValue}
				handleSearch={handleSearchPosts}
			/>
			<HomeTabs />
			<Grid container direction="column" wrap="nowrap" spacing={3}>
				{state.fetchState !== "OK" ? (
					<>
						<CardSkeleton />
						<CardSkeleton />
						<CardSkeleton />
						<CardSkeleton />
						<CardSkeleton />
						<CardSkeleton />
						<CardSkeleton />
						<CardSkeleton />
						<CardSkeleton />
						<CardSkeleton />
					</>
				) : (
					<>
						{state.posts.map((post) => (
							<Grid item key={post.id}>
								<PostCard
									userId={post.user.id}
									imageUrl={post.user.image?.url}
									name={post.user.name}
									place={transformPlace(post.place)}
									dateTime={transformDateTime(post.dateTime.toString())}
									content={post.content}
									currentUserId={currentUser!.id}
									onClickProfile={() => onClickProfile(post.user.id)}
									onClickPost={() => onClickPost(post.id)}
									postCardType="home"
								/>
							</Grid>
						))}
					</>
				)}
			</Grid>
		</Box>
	);
});

// export const Home: FC = memo(() => {
// 	const [posts, setPosts] = useState<OutputPost[]>([]);
// 	const navigate = useNavigate();

// 	const onClickProfile = (id: number) => {
// 		navigate(`/users/${id}`);
// 	};

// 	const handleGetAllPosts = async () => {
// 		try {
// 			const res = await getAllPosts();
// 			setPosts(res.data);
// 		} catch (e) {
// 			console.error(e);
// 		}
// 	};

// 	useEffect(() => {
// 		handleGetAllPosts();
// 	}, []);

// 	return (
// 		<Box p="40px">
// 			<Grid container direction="column" wrap="nowrap" spacing={3}>
// 				{posts.map((post) => (
// 					<Grid item key={post.id}>
// 						<Card
// 							sx={{
// 								height: "220px",
// 								bg: "white",
// 								borderRadius: "md",
// 								shadow: "md",
// 								cursor: "pointer",
// 								p: 2,
// 							}}
// 						>
// 							<Box onClick={() => onClickProfile(post.user.id)}>
// 								<Avatar src={post.user.image?.url} />
// 								<Typography>{post.user.name}</Typography>
// 							</Box>
// 							<Box
// 							>
// 								<Typography sx={{ color: "teal", fontSize: "16px" }}>
// 									{transformPlace(post.place)}
// 								</Typography>
// 								<Typography sx={{ color: "teal", fontSize: "16px" }}>
// 									{transformDateTime(post.dateTime)}
// 								</Typography>
// 								<Typography sx={{ color: "teal", fontSize: "16px" }}>
// 									{post.content}
// 								</Typography>
// 							</Box>
// 						</Card>
// 					</Grid>
// 				))}
// 			</Grid>
// 		</Box>
// 	);
// });
