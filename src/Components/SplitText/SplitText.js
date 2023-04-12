

const SplitText = ({text}) => {

  // const shorterLorem =
  //   "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias error harum maxime adipisci amet laborum. Perspiciatis minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit quibusdam sed amet tempora. Sit laborum ab, eius fugit doloribus tenetur fugiat, temporibus enim commodi iusto libero magni deleniti quod quam consequuntur!";

  const formatText = (text, breaks) => {
    let sections = [];
    let rawText = text.split(' ')
    const subsectionLength = Math.floor(rawText.length / breaks);
    let sectionStart = 0;
    let nextSectionEnd = subsectionLength;
    let remainingText = rawText.length;
    while (nextSectionEnd < rawText.length) {
      sections.push(rawText.slice(sectionStart, nextSectionEnd).join(' '))
      sectionStart = nextSectionEnd;
      nextSectionEnd += subsectionLength;
      remainingText -= subsectionLength;
    }
    if (remainingText) {
      let additionalText = rawText.slice(rawText.length - remainingText).join(' ')
      sections[sections.length - 1] = sections[sections.length - 1] + ' ' + additionalText;
    }
    return sections;
  }

  return (
    <div id="formatted-txt">
      {formatText(text, 3).map((section, i) => {
        return (
          <div className="formatted-txt-section" key={i}>
            {section}
          </div>
        )
      })}
    </div>
  )
}


export default SplitText;
