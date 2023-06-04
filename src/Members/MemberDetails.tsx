import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import getDomain from "../utils/getDomain";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/pro-regular-svg-icons/faDownload";
import { authApi, WhoAmIResponse } from "../Login/authStore";
import { useFormik } from "formik";

interface MemberDetailsProps {
  member: WhoAmIResponse | null;
  onClose: () => void;
}

const canvasId = "qrCode";
const roles = [
  { title: "Admin", value: "admin" },
  { title: "Paid", value: "paid" },
  { title: "Exempt", value: "exempt" },
  { title: "Demo", value: "demo" },
];

function parseRoles(strings: string[]): { title: string; value: string }[] {
  return strings
    .map((s) => roles.find((r) => r.value === s))
    .filter(<T extends any>(x: T | undefined): x is T => !!x);
}

export default function MemberDetails({ member, onClose }: MemberDetailsProps) {
  const [changeRoles] = authApi.useChangeRolesMutation();
  const form = useFormik({
    initialValues: {
      roles: parseRoles(member?.roles ?? []),
    },
    onSubmit(values) {
      changeRoles({
        memberId: member?.profile?.id ?? "",
        roles: values.roles.map((r) => r.value),
      });
      onClose();
    },
  });

  function downloadQrCode() {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = `${member?.profile?.name} QR Code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Dialog open={!!member} onClose={onClose} fullWidth={true}>
      <DialogTitle>{member?.profile?.name}</DialogTitle>
      <DialogContent>
        <Stack direction="column" alignItems="center">
          <QRCodeCanvas
            id={canvasId}
            value={`${getDomain()}/user/${member?.profile?.id}`}
            size={150}
            level={"H"}
          />
          <Button
            sx={{ marginTop: 2 }}
            onClick={downloadQrCode}
            startIcon={<FontAwesomeIcon icon={faDownload} />}
          >
            Download QR Code
          </Button>
          <Autocomplete
            multiple={true}
            renderInput={(params) => (
              <TextField {...params} label="Roles" placeholder="Roles" />
            )}
            options={roles}
            sx={{ marginTop: 2, width: "100%" }}
            placeholder="Roles"
            getOptionLabel={(o) => o.title}
            value={form.values.roles}
            onChange={(_, value) => form.setFieldValue("roles", value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={form.handleSubmit as () => any}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
