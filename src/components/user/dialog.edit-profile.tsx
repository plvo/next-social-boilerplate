/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { $Enums, user } from "@prisma/client";
// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import useFormZod from "@/hooks/use-form-zod";
import { Form } from "@/components/ui/form";
import InputField from "@/components/global/form-fields/input.form-field";
import SelectField from "@/components/global/form-fields/select.form-field";
import ButtonSubmit from "@/components/global/form-fields/button.submit";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useUser } from "@/hooks/use-user";

const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  pseudo: z
    .string()
    .min(3, "Pseudo must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Pseudo must not contain spaces or special characters"
    ),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().min(3, "Phone number must be 10 digits"),
  //   profile_img: z.string().url(),
  role: z.enum(["USER", "VIP"]),
});

export default function DialogEditProfile({ data }: { data: user }) {
  const [open, setOpen] = useState(false);
  const { form, control, handleSubmit } = useFormZod(userSchema, data);

  const roleValues: SelectOption[] = Object.values($Enums.Role).map((role) => ({
    label: role,
    value: role,
  }));

  const { updateUser, isUpdating, isMutError } = useUser(
    data.id,
    true,
    true,
    () => setOpen(false)
  ).mutation;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(
              updateUser as SubmitHandler<z.infer<typeof userSchema>>
            )}
          >
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done. {JSON.stringify(isMutError)}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <InputField
                control={control}
                name="name"
                label="Name"
                placeholder="Francis Ngannou"
                type="text"
                autoComplete="name"
              />
              <InputField
                control={control}
                name="pseudo"
                label="Pseudo"
                placeholder="thepredator"
                type="text"
                autoComplete="username"
              />
              <InputField
                control={control}
                name="email"
                label="Email"
                placeholder="example@email.com"
                type="email"
                autoComplete="email"
              />
              <InputField
                control={control}
                name="phone"
                label="Phone"
                placeholder="1  234567890"
                type="tel"
                autoComplete="tel"
              />
              <SelectField
                control={control}
                name="role"
                values={roleValues}
                defaultValues={
                  roleValues.map((role) => role.value).includes(data.role)
                    ? data.role
                    : undefined
                }
                label="Role"
                placeholder="Select a role"
              />
            </div>
            <DialogFooter className="mt-4">
              <ButtonSubmit label="Edit" disabled={isUpdating} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
