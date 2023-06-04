import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Event, NewOf } from "../types";
import { useFormik } from "formik";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { fromAddressText } from "mf-google-geocoder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/pro-regular-svg-icons/faSearch";
import * as yup from "yup";

interface AddEventDialogProps {
  onSubmit: (event: NewOf<Event>) => void;
  onClose: () => void;
  open: boolean;
}

const validationSchema = yup.object({
  name: yup.string().required(),
  date: yup.mixed<Dayjs>(),
  image: yup.string().required(),
  location: yup.object({
    type: yup.string().matches(/Point/),
    coordinates: yup.array().of(yup.number()).length(2),
  }),
});

export default function AddEventDialog({
  open,
  onClose,
  onSubmit,
}: AddEventDialogProps) {
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [locationText, setLocationText] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  async function onAdChange() {
    if (!fileInput.current?.files) return;

    const image = await new Promise((resolve) => {
      const file = fileInput.current?.files?.[0] as File;
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result == null || typeof e.target.result !== "string")
          return resolve(null);

        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
    await form.setFieldValue("image", image);
  }

  function handleSubmit(values: NewOf<Event>) {
    onSubmit(values);
    onClose();
  }

  const form = useFormik<NewOf<Event>>({
    initialValues: {
      name: "",
      date: dayjs(),
      image: "",
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function doGeocode() {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const mapEl = document.getElementById("map");
    if (!mapEl || !apiKey) return;

    setIsMapLoading(true);
    try {
      const [{ location }] = await Promise.all([
        await fromAddressText(locationText, { apiKey }),
        new Loader({
          apiKey,
          version: "weekly",
        }).load(),
      ]);

      const map = new google.maps.Map(mapEl, {
        center: location,
        zoom: 15,
      });
      new google.maps.Marker({
        position: location,
        map,
      });
      await form.setFieldValue("location", {
        type: "Point",
        coordinates: [location.lat, location.lng],
      });
    } finally {
      setIsMapLoading(false);
    }
  }
  const hasLocation =
    form.values.location.coordinates[0] !== 0 ||
    form.values.location.coordinates[1] !== 0;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Event</DialogTitle>
      <DialogContent>
        <Stack direction="column" py={2} gap={2}>
          <TextField
            name="name"
            id="name"
            label="Name"
            onChange={form.handleChange}
            value={form.values.name}
          />
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="Date"
            onChange={(newValue) => form.setFieldValue("date", newValue)}
            value={form.values.date}
          />
          <label>
            Ad:
            <input
              type="file"
              accept="image"
              multiple={true}
              ref={fileInput}
              onChange={onAdChange}
            />
          </label>
          {form.values.image && (
            <img src={form.values.image} alt="Event flyer" />
          )}
          <TextField
            name="location"
            id="location"
            label="Location"
            onChange={(e) => setLocationText(e.target.value)}
            value={locationText}
            disabled={isMapLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={doGeocode} disabled={isMapLoading}>
                    <FontAwesomeIcon icon={faSearch} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box height={hasLocation ? 300 : 0} id="map" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={form.handleSubmit as () => any}
          disabled={!form.isValid || !hasLocation}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
