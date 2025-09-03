import { Stack, TextField, useTheme } from "@mui/material";
import { MuiTelInput, type MuiTelInputInfo } from "mui-tel-input";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { typDeliveryInfo } from "../../../../../content/types";

interface Props {
  register: UseFormRegister<typDeliveryInfo>;
  errors: FieldErrors<typDeliveryInfo>;
  setValue: UseFormSetValue<typDeliveryInfo>;
  watch: UseFormWatch<typDeliveryInfo>;
}

export default function DeliveryForm({
  register,
  errors,
  setValue,
  watch,
}: Props) {
  const theme = useTheme();
const fullPhone = watch("phone.countryCode") + watch("phone.number");

  return (
    <>
      {/* Customer Name */}
      <Stack direction="column" sx={{ mt: 2 }}>
        <label htmlFor="name" className="label-text">
          Customer Name
        </label>
        <TextField
          id="name"
          variant="filled"
          fullWidth
          error={!!errors.name}
          helperText={errors.name ? "Name is required." : ""}
          {...register("name", { required: true, minLength: 2 })}
          sx={{
            "& .MuiFilledInput-root:after": {
              borderBottom: `2px solid ${theme.palette.secondary.main}`,
            },
          }}
        />
      </Stack>

      {/* Phone Number using mui-tel-input */}
      <Stack direction="column" sx={{ mt: 2 }}>
        <label htmlFor="phone" className="label-text">
          Phone Number
        </label>
        <MuiTelInput
          value={fullPhone}
          id="phone"
          variant="filled"
          fullWidth
          defaultCountry="EG"
          onChange={(value: string, info: MuiTelInputInfo) => {
            // Extract the raw number (digits only, no +, no spaces)
            const rawNumber = value.replace(/\D/g, "");

            // Build the cleaned-up object
            const countryCode = `+${info.countryCallingCode || ""}`;
            const numberWithoutCode = rawNumber.replace(
              info.countryCallingCode || "",
              ""
            );

            // Update form values
            setValue("phone.number", numberWithoutCode, {
              shouldValidate: true,
            });
            setValue("phone.countryCode", countryCode, {
              shouldValidate: true,
            });
            setValue("phone.countryISO", info.countryCode || "", {
              shouldValidate: true,
            });
          }}
          error={!!errors.phone}
          helperText={errors.phone ? "Enter a valid phone number." : ""}
        />
      </Stack>

      {/* Address fields */}
      <Stack direction="column" sx={{ mt: 2 }}>
        <label className="label-text">Delivery Address</label>

        <TextField
          id="house_number"
          label="House Number"
          variant="filled"
          fullWidth
          error={!!errors.address?.address?.house_number}
          helperText={
            errors.address?.address?.house_number
              ? "House number is required."
              : ""
          }
          {...register("address.address.house_number", { required: true })}
          sx={{
            "& .MuiFilledInput-root:after": {
              borderBottom: `2px solid ${theme.palette.secondary.main}`,
            },
          }}
        />

        <TextField
          id="road"
          label="Road"
          variant="filled"
          fullWidth
          sx={{ mt: 2 }}
          error={!!errors.address?.address?.road}
          helperText={errors.address?.address?.road ? "Road is required." : ""}
          {...register("address.address.road", { required: true })}
        />

        <TextField
          id="city"
          label="City"
          variant="filled"
          fullWidth
          sx={{ mt: 2 }}
          error={!!errors.address?.address?.city}
          helperText={errors.address?.address?.city ? "City is required." : ""}
          {...register("address.address.city", { required: true })}
        />

        <TextField
          id="country"
          label="Country"
          variant="filled"
          fullWidth
          sx={{ mt: 2 }}
          error={!!errors.address?.address?.country}
          helperText={
            errors.address?.address?.country ? "Country is required." : ""
          }
          {...register("address.address.country", { required: true })}
        />
      </Stack>
    </>
  );
}
