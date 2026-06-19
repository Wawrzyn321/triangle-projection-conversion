import { Link, ListItem, ListRoot } from '@chakra-ui/react';
import { Section } from '../../components/Section';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';
import { Article } from '../../components/Article';

export function Info() {
  return (
    <Article>
      <Section>
        <Heading>Overview</Heading>
        <Paragraph>
          This tool is designed for creating an accurate 2d projection of a 3d
          geometry.
        </Paragraph>
        <Paragraph>
          Various modelling programs usually generate 3d preview (perspective or
          orthographic), but some information is lost: original geometry is
          converted to a plain image, without the data about vertices and edges.
        </Paragraph>
        <Paragraph>
          Here instead the representation is calculated based on calculated
          based on the geometry and coverted into lines, which in turn can be
          easily scaled and converted to other formats, such as SVG.
        </Paragraph>
      </Section>

      <Section>
        <Heading>Usage</Heading>
        <ListRoot marginLeft={10}>
          <ListItem>
            Load your .stl file and rotate it according to your needs. By
            default the model is scaled to fit on a sheet of paper.
          </ListItem>
          <ListItem>
            Hit "Project" button and see how it is represented in 2d. You can
            adjust the scale now.
          </ListItem>
          <ListItem>
            Either export it to SVG or move it around on virtual paper; you can
            select the necessary page format and rescale it. When you are
            satisfied with the result, export it as PDF to use e.g. as a
            stencil.
          </ListItem>
        </ListRoot>
      </Section>

      <Section>
        <Heading>The algorithm & limitations</Heading>
        <Paragraph>
          This website uses simplified algorithm for extracting visible edges -
          due to numerical errors some artifacts may appear.
        </Paragraph>
        <Paragraph>
          I'm working on a updated version that will be more accurate - if you
          think it will be useful for you, please give it a vote at{' '}
          <Link textIndent={0} textDecoration="underline" href="/vote">
            voting page
          </Link>
          .
        </Paragraph>
        <Paragraph>
          Special thanks to @mglightcad for{' '}
          <Link
            textIndent={0}
            textDecoration="underline"
            href="https://www.npmjs.com/package/@mlightcad/three-viewcube"
            target="_blank"
          >
            three-viewcube
          </Link>
          .
        </Paragraph>
      </Section>
    </Article>
  );
}
