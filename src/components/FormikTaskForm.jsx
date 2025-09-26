import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "../stores/auth-store.js";
import axios from "axios";
import { toast } from "sonner";

const TaskSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Title must be at least 2 characters")
    .max(40, "Title must be less than 40 characters")
    .required("Title is required"),
  content: Yup.string()
    .min(5, "Content must be at least 5 characters")
    .max(600, "Content must be less than 600 characters")
    .required("Content is required"),
  tagId: Yup.number()
    .positive("Please select a valid tag")
    .required("Tag is required"),
  status: Yup.string()
    .oneOf(["PENDING", "IN_PROGRESS", "COMPLETED"], "Invalid status")
    .required("Status is required"),
});

export const FormikTaskForm = ({ tags, onTaskCreated, initialValues = null, taskId = null }) => {
  const { token } = useAuthStore();

  const defaultValues = {
    title: "",
    content: "",
    tagId: "",
    status: "PENDING",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const url = taskId 
        ? `http://localhost:5000/api/v1/tasks/${taskId}`
        : "http://localhost:5000/api/v1/tasks";
      
      const method = taskId ? "put" : "post";
      
      await axios[method](url, {
        ...values,
        tagId: parseInt(values.tagId),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(taskId ? "Task updated successfully!" : "Task created successfully!");
      
      if (!taskId) {
        resetForm();
      }
      
      onTaskCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {taskId ? "Edit Task" : "Create New Task"}
      </h3>
      
      <Formik
        initialValues={initialValues || defaultValues}
        validationSchema={TaskSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <Field
                name="title"
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.title && touched.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <Field
                name="content"
                as="textarea"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none ${
                  errors.content && touched.content ? "border-red-500" : "border-gray-300"
                }`}
              />
              <ErrorMessage name="content" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag *
                </label>
                <Field
                  name="tagId"
                  as="select"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.tagId && touched.tagId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a tag</option>
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="tagId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <Field
                  name="status"
                  as="select"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.status && touched.status ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </Field>
                <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isSubmitting ? "Saving..." : (taskId ? "Update Task" : "Create Task")}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};