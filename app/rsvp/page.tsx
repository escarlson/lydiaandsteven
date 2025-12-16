export default function RSVP() {
  return (
    <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <h1>Find Your Invitation</h1>
            <p>
              Look up your invitation by entering your first and last name below.
            </p>
            <p><strong>Please RSVP by July 12th.</strong></p>
            <form>
              <div className="row g-3 justify-content-center">
                <div className="form-floating col-sm-4">
                  <input type="text" id="floatingFirstName" className="form-control" placeholder="First name" aria-label="First name"></input>
                  <label htmlFor="floatingFirstName">First name</label>
                </div>
                <div className="form-floating col-sm-4">
                  <input type="text" className="form-control" placeholder="Last name" aria-label="Last name"></input>
                  <label htmlFor="floatingLastName">Last name</label>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary">Find Invitation</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
