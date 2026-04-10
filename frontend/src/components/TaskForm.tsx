import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Task, TaskStatus } from '../types';
import { InputField } from './InputField';
import { TextAreaField } from './TextAreaField';

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}

interface Props {
  initialValues?: Partial<Task>;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel?: () => void;
}

const schema = yup.object({
  title: yup.string().min(1, 'Title is required').required('Title is required'),
  description: yup.string().optional().default(''),
  status: yup.mixed<TaskStatus>().oneOf(['todo', 'in-progress', 'done']).required('Status is required'),
  dueDate: yup.string().required('Due date is required')
});

export const TaskForm = ({ initialValues, onSubmit, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      status: initialValues?.status || 'todo',
      dueDate: initialValues?.dueDate ? initialValues.dueDate.slice(0, 10) : ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl bg-white p-6 shadow-lg">
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          {initialValues?.title ? 'Update Task' : 'Create New Task'}
        </h2>
        <p className="mt-1 text-sm text-slate-500">Fill in the task details below</p>
      </div>
      
      <InputField 
        label="Task Title" 
        placeholder="e.g., Design login page"
        error={errors.title?.message} 
        {...register('title')} 
      />
      
      <TextAreaField 
        label="Description (Optional)" 
        placeholder="Describe the task details..."
        error={errors.description?.message} 
        {...register('description')} 
      />
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
          <select 
            id="status"
            {...register('status')} 
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <InputField 
          label="Due Date" 
          type="date" 
          error={errors.dueDate?.message} 
          {...register('dueDate')} 
        />
      </div>
      
      <div className="flex gap-3 pt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-2.5 text-white font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-70 transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
        >
          {isSubmitting ? 'Saving...' : (initialValues?.title ? 'Update Task' : 'Create Task')}
        </button>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors active:scale-95"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
