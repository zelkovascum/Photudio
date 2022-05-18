import {
	FC,
	memo,
	MouseEvent,
	useCallback,
	useContext,
	useEffect,
	useReducer,
} from "react";
import { Avatar, Box, Button, Card, Grid, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllPosts } from "utils/api/post";
import { transformDateTime, transformPlace } from "utils/transformForRead";
import { postsInit, postsReducer } from "reducers/posts";
import { HomeSkeleton } from "components/atoms/posts/HomeSkeleton";
import { HomeTabs } from "components/molucules/posts/HomeTabs";
import { MapContext } from "providers/MapProvider";
import { calculateDistance } from "utils/calculateDistance";
import { Post } from "types";
import { createReaction } from "utils/api/reaction";
import { AuthContext } from "providers/AuthProvider";

export const Home: FC = memo(() => {
	const [state, dispatch] = useReducer(postsReducer, postsInit);
	const { lat, lng } = useContext(MapContext);
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();

	const onClickProfile = (id: number) => {
		navigate(`/users/${id}`);
	};

	const onClickReaction = async (
		e: MouseEvent<HTMLButtonElement>,
		fromUserId: number,
		toUserId: number
	) => {
		e.preventDefault();
		try {
			await createReaction({
				fromUserId,
				toUserId,
			});
			console.log("create reaction!");
		} catch (e) {
			console.error(e);
		}
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
			await getAllPosts().then((res) => {
				dispatch({
					type: "FETCH_SUCCESS",
					payload:
						location.pathname === "/near"
							? sortPostsByDistance([...res.data])
							: res.data,
				});
			});
		} catch (e) {
			console.error(e);
		}
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
				p: "40px",
			}}
		>
			<HomeTabs />
			<Grid container direction="column" wrap="nowrap" spacing={3}>
				{state.fetchState !== "OK" ? (
					<>
						<HomeSkeleton />
						<HomeSkeleton />
						<HomeSkeleton />
					</>
				) : (
					<>
						{state.posts.map((post) => (
							<Grid item key={post.id}>
								<Card
									sx={{
										width: {
											xs: "250px",
											sm: "350px",
											md: "450px",
											lg: "550px",
											xl: "600px",
										},
										height: "220px",
										m: "auto",
										borderRadius: 1,
										cursor: "pointer",
										p: 2,
									}}
								>
									<Box onClick={() => onClickProfile(post.user.id)}>
										<Avatar src={post.user.image?.url} />
										<Typography>{post.user.name}</Typography>
									</Box>
									<Box>
										<Typography sx={{ color: "teal", fontSize: "16px" }}>
											{transformPlace(post.place)}
										</Typography>
										<Typography sx={{ color: "teal", fontSize: "16px" }}>
											{transformDateTime(post.dateTime.toString())}
										</Typography>
										<Typography sx={{ color: "teal", fontSize: "16px" }}>
											{post.content}
										</Typography>
										<Button
											onClick={(e) =>
												onClickReaction(e, currentUser!.id, post.user.id)
											}
										>
											リアクション
										</Button>
									</Box>
								</Card>
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
