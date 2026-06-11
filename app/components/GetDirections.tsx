import ErrorBoundary from "./ErrorBoundary";

type Props = {
  googleURL: string;
  wazeURL: string;
}

export default function GetDirections({ googleURL, wazeURL }: Props) {
  return (
    <ErrorBoundary>
      <div className="get-directions d-flex align-items-end mb-2">
        <div className="me-2">
          <a className="btn btn-outline-midnight" href={googleURL} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        </div>
        <div className="">
          <a className="btn btn-outline-midnight" href={wazeURL} target="_blank" rel="noopener noreferrer">
            Open in Waze
          </a>
        </div>
      </div>
    </ErrorBoundary>
  )
}