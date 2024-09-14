import { isAddress } from 'viem';
import { FC } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useConnect } from 'wagmi'

import close from '../../assets/images/clear_close_icon.svg';
import styles from './AddToken.module.css';
import Warning from './Warning';

export interface AddTokenType {
  handleClose: ()=>void
}

const AddToken:FC<AddTokenType> = ({handleClose}:AddTokenType) => {
  const handleButton = () => {
    console.log(isAddress('0xf93fc5Fa31b37859b9dc4693789DD4b063e53E9D'));
  }

  return (
    <div className={styles.addToken}>
      <div className={styles.headerWrapper}>
        <h5 className={styles.header}>Add a custom token</h5>
        <button className={styles.closeForm} onPointerDown={handleClose}> 
          <img src={close} alt="close" />
        </button>
      </div>
      <Warning warningMessage='Anyone can create a token, including creating fake versions of existing tokens. Be aware of scams and security risks'/>
      <button onPointerDown={handleButton}></button>
    </div>
  )

};

export default AddToken;


type Inputs = {
  example: string
  exampleRequired: string
}


export function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)


  console.log(watch("example")) // watch input value by passing the name of it


  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <input defaultValue="test" {...register("example")} />


      {/* include validation with required or other standard HTML validation rules */}
      <input {...register("exampleRequired", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}


      <input type="submit" />
    </form>
  )
}