/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useState } from 'react';
import { $Enums, user } from '@prisma/client';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useZodForm, getChangedFields } from 'shext';
import { Form } from '@/components/ui/form';
import InputField from '@/components/ui/shuip/input.form-field';
import { SelectField } from '@/components/ui/shuip/select.form-field';
import { ButtonSubmit } from '@/components/ui/shuip/button.submit';
import { useUser } from '@/hooks/use-user';

const userSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name must not exceed 50 characters'),
  pseudo: z
    .string()
    .min(3, 'Pseudo must be at least 3 characters')
    .max(20, 'Pseudo must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Pseudo must not contain spaces or special characters'),
  email: z.string().email({ message: 'Invalid email' }),
  phone: z.string().min(3, 'Phone number must be 3 digits'),
  role: z.enum(['USER', 'VIP']),
});

type UserSchema = z.infer<typeof userSchema>;

export default function DialogEditProfile({ data }: { data: user }) {
  const [open, setOpen] = useState(false);
  const roleValues: SelectOption[] = Object.values($Enums.Role).map((role) => ({
    label: role,
    value: role,
  }));

  const { form, control, handleSubmit, formState } = useZodForm(userSchema, data);

  const { updateUser, isUpdating } = useUser(data.pseudo, true, true).mutation;

  const onSubmit = async (newData: UserSchema) => {
    try {
      if (!formState.isDirty) return; // check if form has been changed
      const changedFields = getChangedFields(data, newData); // get changed fields
      if (Object.keys(changedFields).length === 0) return; // check if there are changes

      await updateUser(changedFields);
      form.reset({ ...data, ...changedFields });
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re done.
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
                defaultValues={roleValues.map((role) => role.value).includes(data.role) ? data.role : undefined}
                label="Role"
                placeholder="Select a role"
              />
            </div>
            <DialogFooter className="mt-4">
              <ButtonSubmit label="Edit" disabled={!formState.isDirty} loading={isUpdating} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
