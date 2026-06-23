import type { AlgoReturnWithName } from '../../Area3d/types';
import { segment2dIterator } from '../../iterators';
import type { PaperFormat } from '../components/PaperSizeSelect';

export async function createAndSavePdf(
  result: AlgoReturnWithName,
  format: PaperFormat['name'],
) {
  const name = `${result.fileName}.pdf`;

  try {
    const { jsPDF } = await import('jspdf');

    const doc = new jsPDF({
      format: format.toLowerCase(),
    });

    for (const [p1, p2] of segment2dIterator(result)) {
      doc.line(p1.x, p1.y, p2.x, p2.y);
    }

    doc.save(name);
  } catch (e) {
    alert('Something unexpected happened');
    console.warn(e);
  }
}
