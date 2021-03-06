import {
	ChangeEvent,
	Dispatch,
	FC,
	memo,
	MouseEvent,
	SetStateAction,
	useCallback,
	useState,
} from "react";
import { Box, Button, Typography, Modal, Input } from "@mui/material";
import { updateUserImage } from "utils/api/user";
import { Modalstyle } from "components/pages/users/Setting";

type Props = {
	isOpenModal: boolean;
	setIsOpenModal: Dispatch<SetStateAction<boolean>>;
	userId: number;
};

export const ImageUploadModal: FC<Props> = memo((props) => {
	const { isOpenModal, setIsOpenModal, userId } = props;
	const [image, setImage] = useState<File>();

	const uploadImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setImage(e.target.files![0]);
	}, []);

	const createFormData = (): FormData => {
		const formData = new FormData();
		if (image) formData.append("image", image);
		return formData;
	};

	const handleUpdateImage = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const data = await createFormData();
		await updateUserImage(data, userId)
			.then((res) => {
				setImage(undefined);
				window.location.reload();
			})
			.catch((e) => console.error(e));
	};

	return (
		<Modal open={isOpenModal} onClose={() => setIsOpenModal(false)}>
			<Box sx={Modalstyle}>
				<Typography fontSize={1}>画像をアップロード</Typography>
				<Input
					type="file"
					// accept="image/*"
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						uploadImage(e);
					}}
					sx={{ fontSize: 10 }}
				/>
				<Button type="submit" onClick={handleUpdateImage} disabled={!image}>
					適用
				</Button>
			</Box>
		</Modal>
	);
});
