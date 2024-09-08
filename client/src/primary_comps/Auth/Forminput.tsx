import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ChangeEventHandler } from 'react';
import './styles.scss'; 

const FormInput = ({ placeholder, name, type, handleChange, icon }: { placeholder: string, name: string, type: string, handleChange: ChangeEventHandler<HTMLInputElement>, icon: IconProp }) => {
  return (
    <div className="mb-3 d-flex align-items-center">
      <FontAwesomeIcon icon={icon} className='icon ' />
      <input placeholder={placeholder} className="form-control bg-dark loginhover" id={name} name={name} type={type} onChange={handleChange} />
      <label className='ms-4' htmlFor={name}></label>
    </div>
  );
};

export default FormInput;
