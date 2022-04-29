import { FC, memo, MouseEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Box } from "@mui/material";
import Cookies from "js-cookie";
import { AuthContext } from "providers/AuthProvider";
import { signOut } from "utils/api/auth";
import { ImageUploadModal } from "components/molucules/ImageUploadModal";

export const Setting: FC = memo(() => {
	const { loading, isSignIn, setIsSignIn, currentUser } =
		useContext(AuthContext);
	const navigate = useNavigate();

	const [isOpenModal, setIsOpenModal] = useState(false);

	const handleSignOut = async (e: MouseEvent<HTMLButtonElement>) => {
		try {
			const res = await signOut();
			if (res.data.success === true) {
				// サインアウト時に各Cookieを削除
				Cookies.remove("_access_token");
				Cookies.remove("_client");
				Cookies.remove("_uid");
				setIsSignIn(false);
				navigate("/signin");
				console.log("Succeeded in sign out");
			} else {
				console.log("Failed in sign out");
			}
		} catch (e) {
			console.error(e);
		}
	};

	function AuthButtons() {
		if (!loading) {
			if (isSignIn) {
				return (
					<Button color="warning" onClick={handleSignOut}>
						ログアウト
					</Button>
				);
			} 
				return (
					<>
						{/* <Button component={Link} to="/signin" color="inherit">
							ログイン
						</Button>
						<Button component={Link} to="/signup" color="inherit">
							新規登録
						</Button> */}
					</>
				);
			
		} 
			return <></>;
		
	}

	return (
		<>
			{isSignIn && currentUser ? (
				<Box sx={{ p: 1 }}>
					<Avatar
						alt={currentUser?.name}
						src={`${currentUser.image?.url}`}
						sx={{ width: 50, height: 50 }}
					/>
					<Button onClick={() => setIsOpenModal(true)}>
						プロフィール画像を変更
					</Button>
					<p>Name: {currentUser?.name}</p>
					<AuthButtons />
				</Box>
			) : (
				<>{/* <p>Not signed in</p> */}</>
			)}
			<ImageUploadModal
				isOpenModal={isOpenModal}
				setIsOpenModal={setIsOpenModal}
				userId={currentUser?.id!}
			/>
		</>
	);
});