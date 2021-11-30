type Props = {
  url: string;
  src: string;
  alt: string;
};

function ImageLink({ url, src, alt }: Props) {
  return (
    <div className="ml-3">
      <a rel="noopener" target="_blank" href={url}>
        <img
          alt={alt}
          height="40"
          width="40"
          src={src}
          className="bg-white"
        ></img>
      </a>
    </div>
  );
}

export default ImageLink;
