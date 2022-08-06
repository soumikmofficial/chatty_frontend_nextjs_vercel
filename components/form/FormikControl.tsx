import { Input } from "..";

interface IFormProps {
  type: string;
  name: string;
  control: string;
  label: string;
  placeholder: string;
  [x: string]: any;
}

const FormikControl: React.FC<IFormProps> = (props) => {
  const { control, ...rest } = props;

  switch (control) {
    case "input":
      return <Input {...rest} />;

    default:
      return null;
  }
};

export default FormikControl;
