import React, {useState} from 'react'

function Modal(props) {
    const [randomPassword, setRandomPassword] = useState('');

    function handleGeneratePassword(){
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+={}[]"/?><,.';
        let result = '';
        const passwordLength = 10;
        
        for (let i = 0; i < passwordLength; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
        setRandomPassword(result)
        
    };

    function handlePasswordInsertion() {
        props.passwordGenerated(randomPassword)
    }
    console.log(randomPassword)
  return (
    <>
        <button type="button" onClick={handleGeneratePassword} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            Auto Password
        </button>
      
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="false">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel"><i class="bi bi-key"></i> Use Strong password?</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <p>Protect your account by using a strong, randomly generated password. It'll will be saved into your account for future use.</p>
                <div className='border border-1 rounded bg-dark-subtle px-2 pt-2'><p>{randomPassword}</p></div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Not now</button>
                <button type="button" onClick={handlePasswordInsertion} data-bs-dismiss="modal" className="btn btn-primary">Use password</button>
            </div>
            </div>
        </div>
        </div>
    </>
  )
}

export default Modal
