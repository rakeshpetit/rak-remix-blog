type Props = {
  url: string;
  src: string;
};

function ImageLink({ url, src }: Props) {
  return (
    <div className="ml-3">
      <a target="_blank" href={url}>
        <img height="40" width="40" src={src} className="bg-white"></img>
      </a>
    </div>
  );
}

export default ImageLink;
