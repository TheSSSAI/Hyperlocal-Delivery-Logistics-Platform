import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BusinessHours, DayHours, TimeSlot } from '@/features/store-profile/types';

// Assuming shared UI components are available from a library like REPO-UI-COMPONENTS
// For this example, we'll use standard HTML elements for clarity.
// import { Button } from '@/shared/ui/Button';
// import { Input } from '@/shared/ui/Input';
// import { Switch } from '@/shared/ui/Switch';
// import { Alert } from '@/shared/ui/Alert';

const timeSlotSchema = z.object({
  open: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:mm)'),
  close: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:mm)'),
});

const dayHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  isOpen: z.boolean(),
  slots: z.array(timeSlotSchema),
});

// Zod schema with complex business rule validation for Business Hours (VND-006)
const businessHoursSchema = z.object({
  hours: z.array(dayHoursSchema).length(7),
}).superRefine((data, ctx) => {
  data.hours.forEach((day, dayIndex) => {
    if (day.isOpen) {
      // Sort slots to make overlap checks easier
      const sortedSlots = [...day.slots].sort((a, b) => a.open.localeCompare(b.open));

      for (let i = 0; i < sortedSlots.length; i++) {
        const slot = sortedSlots[i];

        // BR-VND-HOURS-01: Closing time must be after opening time.
        if (slot.open >= slot.close) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['hours', dayIndex, 'slots', i, 'close'],
            message: 'Closing time must be after opening time',
          });
        }

        // BR-VND-HOURS-02: Time slots for the same day cannot overlap.
        if (i > 0) {
          const prevSlot = sortedSlots[i - 1];
          if (slot.open < prevSlot.close) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['hours', dayIndex, 'slots', i, 'open'],
              message: `Time slot overlaps with the previous one (${prevSlot.open} - ${prevSlot.close})`,
            });
          }
        }
      }
    }
  });
});

type BusinessHoursFormData = z.infer<typeof businessHoursSchema>;

interface BusinessHoursFormProps {
  initialData: BusinessHours;
  onSubmit: (data: BusinessHours) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const BusinessHoursForm = ({
  initialData,
  onSubmit,
  isLoading,
  error,
}: BusinessHoursFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<BusinessHoursFormData>({
    resolver: zodResolver(businessHoursSchema),
    defaultValues: {
      hours: daysOfWeek.map((_, index) => {
        const dayData = initialData.find(d => d.dayOfWeek === index);
        return dayData || { dayOfWeek: index, isOpen: false, slots: [{ open: '09:00', close: '17:00' }] };
      })
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hours',
  });

  const handleFormSubmit = (data: BusinessHoursFormData) => {
    onSubmit(data.hours);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <h2 className="text-2xl font-semibold">Business Hours</h2>
      
      {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>}

      <div className="space-y-6">
        {fields.map((dayField, dayIndex) => {
          const { fields: slotFields, append: appendSlot, remove: removeSlot } = useFieldArray({
            control,
            name: `hours.${dayIndex}.slots` as const,
          });

          const isDayOpen = watch(`hours.${dayIndex}.isOpen`);

          return (
            <div key={dayField.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{daysOfWeek[dayIndex]}</h3>
                <Controller
                  name={`hours.${dayIndex}.isOpen`}
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center cursor-pointer">
                       <input type="checkbox" {...field} checked={field.value} className="sr-only peer" />
                       <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900">
                        {isDayOpen ? 'Open' : 'Closed'}
                      </span>
                    </label>
                  )}
                />
              </div>

              {isDayOpen && (
                <div className="mt-4 space-y-4">
                  {slotFields.map((slotField, slotIndex) => (
                    <div key={slotField.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Open</label>
                         <Controller
                            name={`hours.${dayIndex}.slots.${slotIndex}.open`}
                            control={control}
                            render={({ field }) => <input type="time" {...field} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />}
                        />
                         {errors.hours?.[dayIndex]?.slots?.[slotIndex]?.open && <p className="mt-1 text-sm text-red-600">{errors.hours[dayIndex]?.slots?.[slotIndex]?.open?.message}</p>}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Close</label>
                         <Controller
                            name={`hours.${dayIndex}.slots.${slotIndex}.close`}
                            control={control}
                            render={({ field }) => <input type="time" {...field} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />}
                        />
                         {errors.hours?.[dayIndex]?.slots?.[slotIndex]?.close && <p className="mt-1 text-sm text-red-600">{errors.hours[dayIndex]?.slots?.[slotIndex]?.close?.message}</p>}
                      </div>
                      {slotFields.length > 1 && (
                        <button type="button" onClick={() => removeSlot(slotIndex)} className="text-red-600 hover:text-red-800 self-end mb-1">
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => appendSlot({ open: '09:00', close: '17:00' })} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    + Add Time Slot
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};