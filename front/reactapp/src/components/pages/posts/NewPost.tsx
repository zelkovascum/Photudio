import { ChangeEvent, FC, memo, MouseEvent, useRef, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { PlaceInput } from "components/atoms/PlaceInput";
import { DateTimeInput } from "components/atoms/posts/DateTimeInput";
import SendIcon from "@mui/icons-material/Send";
import { toGeocode } from "utils/toGeocode";
import { createPost } from "utils/api/post";
import { useNavigate } from "react-router-dom";

export const NewPost: FC = memo(() => {
	const [placeInputValue, setPlaceInputValue] = useState<string>("");
	const [dateTimeInputValue, setDateTimeInputValue] = useState<Date | null>(
		null
	);
	const [contentInputValue, setContentInputValue] = useState<string>("");
	const navigate = useNavigate();
	const processing = useRef(false);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setContentInputValue(e.target.value);
	};

	const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (processing.current) return;
		processing.current = true;
		const geocode = await toGeocode(placeInputValue);
		const { lat, lng } = geocode!;
		try {
			await createPost({
				lat,
				lng,
				place: placeInputValue,
				dateTime: dateTimeInputValue!,
				content: contentInputValue,
			});
			processing.current = false;
			navigate("/");
		} catch (e) {
			processing.current = false;
			console.error(e);
		}
	};

	return (
		<Box width="100%" height="100%" p="40px">
			<Typography sx={{ as: "h1", textAlign: "center" }} mb={4}>
				新規投稿
			</Typography>
			<Box
				sx={{
					width: "240px",
					height: "240px",
					p: "16px",
					bg: "white",
					mx: "auto",
					borderRadius: "md",
					shadow: "md",
					textAlign: "center",
				}}
			>
				<form>
					<Stack spacing={4}>
						<PlaceInput
							placeInputValue={placeInputValue}
							setPlaceInputValue={setPlaceInputValue}
						/>
						<DateTimeInput
							dateTimeInputValue={dateTimeInputValue}
							setDateTimeInputValue={setDateTimeInputValue}
						/>
						<TextField
							// label="コメント"
							value={contentInputValue}
							onChange={(e) => handleChange(e)}
							type="text"
						/>
						<Button
							// bg="teal"
							// color="white"
							type="submit"
							onClick={(e) => handleSubmit(e)}
							disabled={
								!(placeInputValue && dateTimeInputValue && contentInputValue)
							}
							endIcon={<SendIcon />}
							variant="contained"
						>
							投稿
						</Button>
					</Stack>
				</form>
			</Box>
		</Box>
	);
});
