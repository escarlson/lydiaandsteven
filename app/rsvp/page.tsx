import SubmitButton from "../components/SubmitButton";

export default function RSVP() {
  return (
    <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <h1>✉️ Find Your Invitation</h1>
            <p>
              Look up your invitation by entering your first name, last name, and postal code below. You&apos;ll be able to RSVP for all guests on your invitation.
            </p>
            <p>
              If you have any issues, please email Steven at <a href="mailto:wedding@stevencarlson.me">wedding@stevencarlson.me.</a>
            </p>
            <p><strong>Please RSVP by May 1st.</strong></p>
            <form>
              <div className="row g-3 justify-content-center">
                <div className="form-floating form-floating-copper col-sm-4">
                  <input type="text" id="floatingFirstName" className="form-control" placeholder="First name" aria-label="First name"></input>
                  <label htmlFor="floatingFirstName">First name</label>
                </div>
                <div className="form-floating form-floating-copper col-sm-4">
                  <input type="text" id="floatingLastName" className="form-control" placeholder="Last name" aria-label="Last name"></input>
                  <label htmlFor="floatingLastName">Last name</label>
                </div>
                <div className="form-floating form-floating-copper col-sm-4">
                  <input type="text" id="floatingPostalCode" className="form-control" placeholder="Postal code" aria-label="Postal code"></input>
                  <label htmlFor="floatingPostalCode">Postal code</label>
                </div>
                <div className="col-12">
                  <SubmitButton />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
