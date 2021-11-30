import ImageLink from "./ImageLink";
import githubD from "~/assets/github-dark.png";
import twitter from "~/assets/twitter.png";
import linkedin from "~/assets/linkedin.png";

function Footer() {
  return (
    <footer className="remix-app__footer">
      <div className="container items-center mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <p className="text-gray-400 text-sm text-center sm:text-left items-center">
          © 2021 Copyright: Rakesh Arun
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
          <ImageLink
            alt="My Twitter"
            src={twitter}
            url="https://twitter.com/rakeshpetit"
          />
          <ImageLink
            alt="My Github"
            src={githubD}
            url="https://github.com/rakeshpetit"
          />
          <ImageLink
            alt="My LinkedIn"
            src={linkedin}
            url="https://www.linkedin.com/in/rakesh-arunachalam/"
          />
        </span>
      </div>
    </footer>
  );
}

export default Footer;
