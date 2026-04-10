import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Project, ProjectStatus } from '../types';
import { InputField } from './InputField';
import { TextAreaField } from './TextAreaField';

interface Props {
  initialValues?: Partial<Project>;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onCancel?: () => void;
}

export interface ProjectFormValues {
  title: string;
  description: string;
  status: ProjectStatus;
}

const schema = yup.object({
  title: yup.string().min(1, 'Title is required').required('Title is required'),
  description: yup.string().optional().default(''),
  status: yup.mixed<ProjectStatus>().oneOf(['active', 'completed']).required('Status is required')
});

export const ProjectForm = ({ initialValues, onSubmit, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      status: initialValues?.status || 'active'
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl bg-white p-6 shadow-lg">
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          {initialValues?.title ? 'Update Project' : 'Create New Project'}
        </h2>
        <p className="mt-1 text-sm text-slate-500">Fill in the project details below</p>
      </div>
      
      <InputField 
        label="Project Title" 
        placeholder="e.g., Mobile App Redesign"
        error={errors.title?.message} 
        {...register('title')} 
      />
      
      <TextAreaField 
        label="Description (Optional)" 
        placeholder="Describe your project goals and details..."
        error={errors.description?.message} 
        {...register('description')} 
      />
      
      <div className="space-y-2">
        <label htmlFor="status" className="block text-sm font-medium text-slate-700">Project Status</label>
        <select 
          id="status"
          {...register('status')} 
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-2.5 text-white font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-70 transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
        >
          {isSubmitting ? 'Saving...' : (initialValues?.title ? 'Update Project' : 'Create Project')}
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
