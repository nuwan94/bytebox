export type ToolGuide = {
  /** What the tool does and when it is useful. One string per paragraph. */
  about: string[];
  /** How to use it, in order. */
  steps: string[];
  example?: { caption: string; input: string; output: string };
  faqs: { q: string; a: string }[];
};

// The written guide shown under each tool. Keep every claim in step with what
// the tool's logic.ts really does; guides.test.ts only checks the shape.
export const guides: Record<string, ToolGuide> = {
  "json-formatter": {
    about: [
      "The JSON formatter takes JSON in any layout and rewrites it so it is easy to read, with one value per line and consistent indentation. It can also do the reverse and squeeze JSON onto a single line, which is the form you usually want for a config value, a log line or a request body.",
      "It checks the JSON as it goes. If the text is not valid, you get the parser's message saying what it found and where, such as a trailing comma, a missing quote or an unclosed bracket.",
    ],
    steps: [
      "Paste your JSON into the box on the left.",
      "Choose an indent: two spaces, four spaces or a tab.",
      "Press Format to lay it out, or Minify to put it on one line.",
      "Press Copy result to put the output on your clipboard.",
    ],
    example: {
      caption: "Formatting with a two-space indent",
      input: '{"a":[1,2]}',
      output: '{\n  "a": [\n    1,\n    2\n  ]\n}',
    },
    faqs: [
      {
        q: "Does formatting change my data?",
        a: "Usually only the spacing changes, but the JSON is read and written again, so three things can differ. Whole numbers beyond 9,007,199,254,740,991 are rounded, because JavaScript cannot hold them exactly. A number written as 1.0 comes out as 1. If an object repeats a key, only the last value is kept.",
      },
      {
        q: "Why does it reject comments or trailing commas?",
        a: "Strict JSON allows neither. Files such as tsconfig.json use a looser variant, often called JSONC or JSON5, which this tool does not read. Remove the comments and the final comma before a closing bracket and it will format.",
      },
      {
        q: "Does it sort the keys?",
        a: "No. Keys stay in the order they appear in your input.",
      },
      {
        q: "Is my JSON sent anywhere?",
        a: "No. It is parsed by your own browser and never leaves your device, so it is safe to paste API responses and configuration that contain secrets.",
      },
    ],
  },

  base64: {
    about: [
      "Base64 writes any data using only letters, digits and a few symbols, so it can travel through places that expect plain text: an email, a JSON field, a data URL or an HTTP header. This tool converts text to Base64 and back.",
      "Text is turned into bytes as UTF-8 first, so accented letters, non-Latin scripts and emoji all survive the round trip. The URL-safe option produces the variant used in web tokens and links, which swaps + and / for - and _ and drops the = padding.",
    ],
    steps: [
      "Type or paste text into the box on the left.",
      "Press Encode to turn text into Base64, or Decode to turn Base64 back into text.",
      "Tick URL-safe when encoding if the result will go in a URL or a file name.",
      "Press Copy result to copy the output.",
    ],
    example: { caption: "Encoding a word", input: "hello", output: "aGVsbG8=" },
    faqs: [
      {
        q: "Is Base64 a form of encryption?",
        a: "No. It is a different way of writing the same data, and anyone can reverse it. Do not use it to hide passwords or keys.",
      },
      {
        q: "Why does decoding fail with a message about UTF-8?",
        a: "The Base64 is valid but it decodes to bytes that are not text, such as an image or a compressed file. This tool only shows text, so it stops there instead of printing garbage.",
      },
      {
        q: "Does it accept URL-safe Base64 or missing padding when decoding?",
        a: "Yes. Decode reads both the standard and URL-safe alphabets, ignores line breaks and spaces, and works whether or not the = signs are present.",
      },
      {
        q: "Why is the output longer than the input?",
        a: "Base64 uses four characters for every three bytes, so the result is about a third larger than the original.",
      },
    ],
  },

  "url-encoder": {
    about: [
      "URLs can only contain a limited set of characters. Anything else, including spaces, accented letters and symbols such as & and =, has to be written as a percent sign followed by hex digits. This tool does that percent-encoding and reverses it.",
      "By default it encodes everything that has a special meaning, which is right for a single value such as one query parameter. If you are encoding a whole address, tick the option to keep the characters that give a URL its structure.",
    ],
    steps: [
      "Paste the text or URL into the box on the left.",
      "Leave the option unticked for a single value, or tick it to keep : / ? & = in a full URL.",
      "Press Encode or Decode.",
      "Press Copy result to copy the output.",
    ],
    example: { caption: "Encoding one query value", input: "a b&c=d/é", output: "a%20b%26c%3Dd%2F%C3%A9" },
    faqs: [
      {
        q: "Why is a space %20 and not a plus sign?",
        a: "Both appear in the wild. %20 is valid everywhere in a URL, while + only means a space inside form-style query strings. This tool always writes %20, and when decoding it leaves a + as a +.",
      },
      {
        q: "When should I keep the URL structure?",
        a: "Tick it when the input is a complete address and you only want to fix illegal characters such as spaces. Leave it unticked when the input is one piece that will be inserted into a URL, so that any & or / inside it cannot be mistaken for part of the address.",
      },
      {
        q: "Why does decoding fail?",
        a: "A percent sign is not followed by two hex digits, or the escaped bytes are not valid UTF-8. A literal percent sign has to be written as %25.",
      },
    ],
  },

  uuid: {
    about: [
      "A UUID is a 128-bit identifier written as 32 hex digits in five groups. Because the chance of two random ones matching is negligible, they can be created anywhere without checking a central list, which makes them useful as database keys, request IDs and test data.",
      "This tool makes version 4 UUIDs, the fully random kind, using your browser's cryptographic random number generator. You can make up to 100 at once.",
    ],
    steps: [
      "Enter how many UUIDs you need, from 1 to 100.",
      "Tick Uppercase or untick Hyphens if your system expects that format.",
      "Press Make UUIDs.",
      "Press Copy all to copy the list, one per line.",
    ],
    example: {
      caption: "One UUID in the default format",
      input: "How many: 1",
      output: "823cf2f7-8569-489e-a117-032a79ebdb28",
    },
    faqs: [
      {
        q: "Can two of these ever be the same?",
        a: "In theory, but each has 122 random bits, so a duplicate is not something to plan for in practice.",
      },
      {
        q: "Which UUID versions does it make?",
        a: "Only version 4. It does not make time-based versions such as 1 or 7, so the results are not sortable by creation time.",
      },
      {
        q: "What is the difference between a UUID and a GUID?",
        a: "Nothing but the name. GUID is the term Microsoft uses for the same 128-bit identifier, and tools that ask for a GUID will accept these.",
      },
      {
        q: "Are random UUIDs a good database primary key?",
        a: "They work and are widely used. On very large tables their randomness spreads new rows across the whole index, which can slow inserts compared with a key that grows over time, so some teams prefer time-ordered identifiers there.",
      },
      {
        q: "Are the UUIDs stored or sent anywhere?",
        a: "No. They are generated in your browser and disappear when you leave the page.",
      },
    ],
  },

  hash: {
    about: [
      "A hash function turns any input into a fixed-length fingerprint. The same input always gives the same hash, and changing a single character gives a completely different one. Hashes are used to check that a download is intact, to compare values without storing them and to build cache keys.",
      "This tool shows the SHA-1, SHA-256 and SHA-512 hashes of whatever you type, as lowercase hex, and updates them as you type.",
    ],
    steps: [
      "Type or paste the text to hash.",
      "Read the three hashes below. They update with every keystroke.",
      "Press Copy next to the one you need.",
    ],
    example: {
      caption: "The SHA-256 hash of three letters",
      input: "abc",
      output: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    },
    faqs: [
      {
        q: "Why is my hash different from the one another tool gives?",
        a: "The usual cause is an invisible difference in the input: a trailing line break, a space at the end, or a different text encoding. This tool hashes exactly the characters in the box, as UTF-8.",
      },
      {
        q: "Can I use these to store passwords?",
        a: "No. SHA hashes are fast by design, which makes guessing passwords cheap. Use a function made for passwords, such as Argon2 or bcrypt.",
      },
      {
        q: "Is SHA-1 still safe?",
        a: "Not where an attacker could craft the input, because two different inputs with the same SHA-1 hash have been produced. It is still common for non-security uses such as identifying content. Prefer SHA-256 for anything new.",
      },
      {
        q: "Why is there no MD5, and can it hash files?",
        a: "The tool uses the hashing built into browsers, which does not include MD5. It hashes text only, not files.",
      },
    ],
  },

  jwt: {
    about: [
      "A JSON Web Token is three pieces of Base64 text joined by dots: a header saying how it was signed, a payload of claims such as the user ID and expiry time, and a signature. This tool decodes the first two pieces and shows them as formatted JSON.",
      "If the payload has an exp claim, the tool also tells you when the token expires, or that it already has, in your local time. It is a quick way to see why an API is rejecting a token.",
    ],
    steps: [
      "Paste the whole token into the Token box.",
      "Press Read token.",
      "Read the header and payload below, and the expiry time in the message next to the cat.",
    ],
    example: {
      caption: "The first part of a token, decoded",
      input: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      output: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
    },
    faqs: [
      {
        q: "Does it verify the signature?",
        a: "No. It only decodes the token, so a forged or tampered token will read just as well as a real one. Verification needs the signing key and should happen on your server.",
      },
      {
        q: "Is it safe to paste a real token?",
        a: "The token is decoded in your browser and is not sent anywhere. Still, treat live tokens like passwords and prefer one that has expired or belongs to a test account.",
      },
      {
        q: "Is the payload of a JWT secret?",
        a: "No. Anyone holding the token can decode it exactly as this tool does. The signature stops changes, not reading, so never put confidential data in a token.",
      },
      {
        q: "Why does it say the token needs three parts?",
        a: "The text is not a signed JWT. Encrypted tokens have five parts and cannot be read without the key, and a truncated copy and paste often loses a part.",
      },
    ],
  },

  regex: {
    about: [
      "A regular expression is a pattern for finding text: every date in a log, every email address in a document, every line that starts with a keyword. This tool lets you write a pattern and see straight away which parts of a sample text it matches.",
      "You can start from a common pattern, such as an email address, a URL, a date or a UUID, and adjust it. You can also build a pattern from named pieces if you do not remember the syntax. Patterns use the JavaScript flavour of regular expressions.",
    ],
    steps: [
      "Replace the sample text with the text you want to search.",
      "Pick a common pattern, add pieces one at a time, or type your own pattern.",
      "Tick the options you need: ignore case, per-line anchors, or letting the dot match line breaks.",
      "Check the highlighted matches and the count, then adjust the pattern until it finds exactly what you want.",
    ],
    example: {
      caption: "Finding a date",
      input: "Pattern: \\d{4}-\\d{2}-\\d{2}\nText: Order 1042 shipped on 2026-03-14.",
      output: "1 match: 2026-03-14",
    },
    faqs: [
      {
        q: "Will my pattern work in Python, Java or PHP?",
        a: "Mostly. Basic syntax is shared, but details differ, including named groups, lookbehind and Unicode classes. Test in your target language before relying on it.",
      },
      {
        q: "Are the common patterns strict validators?",
        a: "No. They are practical patterns for finding things in text. The email pattern, for example, finds ordinary addresses but does not follow the full email standard, so use a proper validator where correctness matters.",
      },
      {
        q: "Why was my pattern stopped?",
        a: "Some patterns take an enormous amount of time on certain text, usually when a repeated group contains another repeat, as in (a+)+. Matching runs in the background and is stopped after two seconds so the page stays usable. Simplify the pattern, because the same thing would hang a real program.",
      },
      {
        q: "How many matches does it show?",
        a: "Up to 1,000. Matches of zero length, such as a bare ^, are counted but have nothing to highlight.",
      },
    ],
  },

  timestamp: {
    about: [
      "Computers often store a moment in time as a Unix timestamp: the number of seconds, or milliseconds, since the start of 1970 in UTC. It is compact and unambiguous, but not something a person can read. This tool converts a timestamp to a readable date and a date back to a timestamp.",
      "It shows each result four ways: an ISO 8601 date in UTC, the date in your own time zone, Unix seconds and Unix milliseconds.",
    ],
    steps: [
      "Type a Unix timestamp or a date such as 2026-03-14T09:30:00Z.",
      "Press Convert, or press Enter.",
      "Press Use the time now to fill in the current moment.",
      "Press Copy next to the format you need.",
    ],
    example: { caption: "A ten-digit timestamp", input: "1700000000", output: "2023-11-14T22:13:20.000Z" },
    faqs: [
      {
        q: "How does it know whether a number is seconds or milliseconds?",
        a: "By size. A number below 100,000,000,000 is read as seconds and anything larger as milliseconds, and the message next to the cat says which was used. Today's timestamps are ten digits in seconds and thirteen in milliseconds.",
      },
      {
        q: "Which date formats can I type?",
        a: "ISO 8601 dates, such as 2026-03-14 or 2026-03-14T09:30:00Z, work in every browser. Other formats are passed to your browser's date parser and may be read differently from one browser to the next.",
      },
      {
        q: "Which time zone is the local time in?",
        a: "The one your device is set to. A date typed without a time zone is also read in that zone, except a date with no time at all, which is read as midnight UTC.",
      },
      {
        q: "Can it handle dates before 1970?",
        a: "Yes. They are negative timestamps, so -86400 is the last day of 1969.",
      },
    ],
  },

  "case-converter": {
    about: [
      "Different languages and file formats expect names in different styles: camelCase for JavaScript variables, snake_case for Python and database columns, kebab-case for URLs and CSS classes, CONSTANT_CASE for environment variables. This tool rewrites one name in six styles at once.",
      "It works out where the words are from spaces, punctuation and changes of case, so you can paste a phrase or an existing identifier in any style.",
    ],
    steps: [
      "Type a phrase or paste an identifier into the box.",
      "Read the six versions below. They update as you type.",
      "Press Copy next to the style you need.",
    ],
    example: {
      caption: "An identifier with an acronym, shown in snake case",
      input: "parseHTTPResponse_code-v2",
      output: "parse_http_response_code_v2",
    },
    faqs: [
      {
        q: "How does it treat acronyms such as HTTP or ID?",
        a: "A run of capitals is kept together as one word, so parseHTTPResponse splits into parse, HTTP and Response. In camel and Pascal case each word then gets a single capital, giving parseHttpResponse.",
      },
      {
        q: "Which style is used where?",
        a: "By common convention: camel case for variables and functions in JavaScript and Java, Pascal case for classes and React components, snake case in Python, Ruby and SQL column names, kebab case in URLs, CSS classes and file names, and constant case for constants and environment variables. Follow your project's own style guide where it differs.",
      },
      {
        q: "What happens to numbers?",
        a: "Digits stay attached to the letters before them, so v2 remains one word.",
      },
      {
        q: "Can I convert a whole file or several names at once?",
        a: "No. The whole input is treated as one name. Line breaks and punctuation count as word separators.",
      },
    ],
  },

  "text-diff": {
    about: [
      "A diff shows what changed between two versions of a text. This tool compares them line by line and marks each line as unchanged, removed or added, which is handy for config files, SQL, logs or any two pieces of text that are not in version control.",
      "It finds the longest run of lines the two versions share and reports everything else as a change, the same approach command-line diff tools use.",
    ],
    steps: [
      "Paste the original text into Before.",
      "Paste the new text into After.",
      "Read the Changes panel: removed lines are pink with a minus sign, added lines are green with a plus sign.",
      "Check the message next to the cat for the totals.",
    ],
    example: {
      caption: "One changed setting",
      input: "Before: port: 3000\nAfter:  port: 8080",
      output: "- port: 3000\n+ port: 8080",
    },
    faqs: [
      {
        q: "Does it show which words changed within a line?",
        a: "No. It compares whole lines, so a line with one changed character appears as a removal followed by an addition.",
      },
      {
        q: "Do spaces and line endings count as differences?",
        a: "Spaces and tabs do, including ones at the end of a line. Windows and Unix line endings are treated as the same.",
      },
      {
        q: "How large can the texts be?",
        a: "The two line counts multiplied together must not exceed four million, which is about 2,000 lines on each side. Beyond that the tool asks you to compare a smaller section.",
      },
    ],
  },

  "colour-converter": {
    about: [
      "Colours on the web are written in several notations. HEX is compact and common in design files, RGB gives the red, green and blue amounts directly, and HSL describes a colour as hue, saturation and lightness, which is easier to adjust by hand. This tool converts between the three.",
      "Type a colour in any of the notations and you get all three, together with a swatch showing the colour.",
    ],
    steps: [
      "Type a colour such as #ff6fb0, rgb(255, 111, 176) or hsl(333, 100%, 72%).",
      "Check the swatch to confirm it is the colour you meant.",
      "Press Copy next to the notation you need.",
    ],
    example: {
      caption: "A three-digit hex colour",
      input: "#fd0",
      output: "#ffdd00\nrgb(255, 221, 0)\nhsl(52, 100%, 50%)",
    },
    faqs: [
      {
        q: "Does it support transparency?",
        a: "No. Eight-digit hex and alpha values in rgb() or hsl() are not handled.",
      },
      {
        q: "Which notation should I use in CSS?",
        a: "All three work in every current browser, so it is a matter of convenience. HEX is the shortest. HSL is the easiest to adjust by hand: lower the lightness for a hover shade, or change the hue to get a related colour.",
      },
      {
        q: "Can I type a colour name such as tomato?",
        a: "No. It reads HEX, rgb() and hsl() only. In rgb() and hsl() the values can be separated by commas or spaces.",
      },
      {
        q: "Why does converting to HSL and back sometimes change the colour slightly?",
        a: "HSL values are rounded to whole numbers, and several neighbouring RGB colours can round to the same HSL value. Going back can therefore differ by one step in a channel, which is not visible.",
      },
    ],
  },

  password: {
    about: [
      "A strong password is long and random. This tool makes one from the character types you choose, using your browser's cryptographic random number generator instead of a predictable one.",
      "Every password contains at least one character from each type you ticked, so it will satisfy sites that insist on a digit or a symbol. The tool also estimates the strength in bits, to show how much a longer password helps.",
    ],
    steps: [
      "Set the length, from 4 to 128 characters.",
      "Tick the character types to include: lowercase, uppercase, digits and symbols.",
      "Press Make password.",
      "Press Copy, then save it in your password manager.",
    ],
    example: {
      caption: "The default settings",
      input: "Length 20, all four character types",
      output: "A 20-character password, about 128 bits strong",
    },
    faqs: [
      {
        q: "Is it safe to make a password on a website?",
        a: "This one is generated on your device and is not sent or stored. You can check that by disconnecting from the internet before pressing the button: it still works. Any page can be changed later, though, so a password manager's built-in generator is the more cautious choice for your most important accounts.",
      },
      {
        q: "How long should a password be?",
        a: "With all four character types, 16 characters gives about 103 bits and 20 gives about 128, both far beyond what can be guessed. Length matters more than symbols: a longer password with letters and digits only is stronger than a short one with everything.",
      },
      {
        q: "Which symbols does it use?",
        a: "These 23: ! @ # $ % ^ & * ( ) - _ = + [ ] { } ; : , . ? If a site rejects one of them, untick Symbols or replace that character by hand.",
      },
      {
        q: "What does the strength in bits mean?",
        a: "It is the length multiplied by the number of bits each character contributes, which depends on how many different characters are possible. Each extra bit doubles the number of guesses an attacker needs.",
      },
    ],
  },

  "number-bases": {
    about: [
      "The same number can be written in different bases. Decimal is what people use, hex is common for colours, memory addresses and byte values, binary shows the individual bits, and octal still appears in Unix file permissions. This tool converts a whole number between all four.",
      "It works with whole numbers of any size, so 64-bit values and longer are converted exactly instead of being rounded.",
    ],
    steps: [
      "Type the number.",
      "Choose the base it is written in: decimal, hex, binary or octal.",
      "Read the number in all four bases below.",
      "Press Copy next to the one you need.",
    ],
    example: { caption: "A byte's largest value", input: "255 (decimal)", output: "Hex ff\nBinary 11111111\nOctal 377" },
    faqs: [
      {
        q: "Can I include a 0x prefix, spaces or underscores?",
        a: "Yes. The prefixes 0x, 0b and 0o are accepted when they match the chosen base, and spaces and underscores used as digit separators are ignored.",
      },
      {
        q: "How are negative numbers shown?",
        a: "With a minus sign in every base, so -10 is -a in hex. It does not use two's complement, because that depends on a fixed width such as 32 or 64 bits.",
      },
      {
        q: "Why do other converters change the last digits of a large number?",
        a: "Many store numbers in 64-bit floating point, which is exact only up to 9,007,199,254,740,991. This tool uses integers of unlimited size, so a 64-bit ID or a 256-bit hash converts without losing a digit.",
      },
      {
        q: "Does it convert fractions?",
        a: "No. It handles whole numbers only and will reject a decimal point.",
      },
    ],
  },

  "line-sorter": {
    about: [
      "Lists tend to arrive messy: out of order, with repeats, stray spaces and blank lines. This tool cleans up a list that has one item per line. It can sort it, remove duplicates, trim spaces from each line and drop empty lines, in any combination.",
      "Sorting is natural, meaning numbers inside the text are compared by value, so file2 comes before file10 instead of after it.",
    ],
    steps: [
      "Paste your list, one item per line.",
      "Choose a sort order, or keep the original order.",
      "Tick the clean-up options you want.",
      "Press Tidy lines, then Copy result.",
    ],
    example: {
      caption: "Sorted A to Z with every clean-up option on",
      input: "pear\napple \nfig\n\napple\nbanana10\nbanana2\n  fig",
      output: "apple\nbanana2\nbanana10\nfig\npear",
    },
    faqs: [
      {
        q: "In what order are the steps applied?",
        a: "Trim, then remove empty lines, then remove duplicates, then sort. Trimming first means that two lines differing only by a trailing space count as duplicates.",
      },
      {
        q: "Can it sort a list of numbers?",
        a: "Yes for whole positive numbers, which sort by value: 9, then 10, then 100. Negative numbers and decimals are not ordered by value, because the minus sign and the decimal point are compared as text.",
      },
      {
        q: "Is duplicate removal case-sensitive?",
        a: "Yes. Apple and apple are kept as two different lines. The first copy of each line is the one that stays.",
      },
      {
        q: "How are capital letters sorted?",
        a: "By dictionary order using English rules, so capitals do not all come first as they would in a plain character-code sort. For the same word, the lowercase version comes before the capitalised one.",
      },
    ],
  },

  "text-counter": {
    about: [
      "Text limits come in different units. A tweet or a meta description is limited in characters, an essay in words, and a database column or an SMS in bytes. This tool counts all of them, along with lines, as you type or paste.",
      "The byte count is for UTF-8, the encoding used by nearly all web pages, files and APIs. In UTF-8 an English letter takes one byte, an accented letter two, most Chinese, Japanese and Korean characters three, and most emoji four.",
    ],
    steps: ["Type or paste your text into the box.", "Read the four counts below. They update as you type."],
    example: {
      caption: "Two accented letters make the byte count larger than the character count",
      input: "héllo wörld\nfoo",
      output: "15 characters, 3 words, 2 lines, 17 bytes",
    },
    faqs: [
      {
        q: "Do spaces and line breaks count as characters?",
        a: "Yes. Every character is counted, including spaces, tabs and line breaks.",
      },
      {
        q: "Is there a limit on how much text it can count?",
        a: "No fixed limit. The text is recounted in your browser on every keystroke, so a document of several megabytes may make typing feel slow.",
      },
      {
        q: "How is a word defined?",
        a: "As any run of characters with no space or line break in it. A hyphenated term or a URL counts as one word, and languages written without spaces between words will be undercounted.",
      },
      {
        q: "Why does one emoji sometimes count as several characters?",
        a: "The tool counts Unicode code points. A simple emoji is one, but some are built from several joined together, such as a family or a flag, and each part is counted.",
      },
    ],
  },

  "lorem-ipsum": {
    about: [
      "Lorem ipsum is nonsense Latin used to fill a layout before the real text exists. Because it has the rhythm of ordinary prose without meaning anything, it lets you judge fonts, spacing and line length without being distracted by the words.",
      "This tool makes between one and twenty paragraphs. The first begins with the traditional words, and the rest is assembled at random from the classic passage, so you get different text each time.",
    ],
    steps: [
      "Enter how many paragraphs you need, from 1 to 20.",
      "Press Make text.",
      "Press Copy to copy the text, with a blank line between paragraphs.",
    ],
    faqs: [
      {
        q: "How long is each paragraph?",
        a: "Three to six sentences of six to fourteen words each, so paragraphs vary in length the way real writing does.",
      },
      {
        q: "Does the output include HTML tags?",
        a: "No. It is plain text with a blank line between paragraphs, so you can wrap it in whatever markup you need.",
      },
      {
        q: "Do I get the same text every time?",
        a: "No. Each press of Make text gives a new arrangement. Only the opening five words are fixed.",
      },
      {
        q: "When should I use real text instead?",
        a: "As soon as you have it. Placeholder text can hide problems, such as a heading that runs to three lines or a button label that does not fit. Lorem ipsum is for the stage before the words exist.",
      },
      {
        q: "Does lorem ipsum mean anything?",
        a: "It comes from a work by Cicero, scrambled long ago so that it no longer reads as proper Latin.",
      },
    ],
  },

  "json-yaml": {
    about: [
      "JSON and YAML describe the same kinds of data: objects, lists, strings, numbers, booleans and null. JSON is what APIs and most programs exchange; YAML is what people tend to write by hand, in Kubernetes manifests, GitHub Actions workflows, Docker Compose files and many app configs. This tool converts in either direction.",
      "It uses the yaml library with YAML 1.2 rules. That matters for a few values: yes, no, on and off stay as text rather than turning into true or false, and a date such as 2026-01-01 stays a string. Anchors and aliases in YAML are expanded in the JSON, so each place an alias was used gets its own full copy.",
    ],
    steps: [
      "Paste JSON or YAML into the box on the left.",
      "Press JSON to YAML or YAML to JSON.",
      "If the input has a mistake, the cat tells you what the parser found and where.",
      "Press Copy result to take the converted text.",
    ],
    example: {
      caption: "A small JSON object as YAML",
      input: '{"name":"bytebox","port":8080,"tools":["json","yaml"]}',
      output: "name: bytebox\nport: 8080\ntools:\n  - json\n  - yaml",
    },
    faqs: [
      {
        q: "What happens to comments in YAML?",
        a: "They are lost. JSON has no comment syntax, so there is nowhere to put them. Converting back to YAML will not bring them back.",
      },
      {
        q: "Can it convert a file with several YAML documents separated by ---?",
        a: "No. It reads a single document and reports an error if it finds more than one. Convert each document separately.",
      },
      {
        q: "Why are some strings quoted in the YAML output?",
        a: "Text that YAML would otherwise read as something else, such as a number, true, null or a value starting with a special character, is quoted so it stays a string when read back.",
      },
      {
        q: "Is my config sent anywhere?",
        a: "No. The conversion happens in your browser, which matters for files that hold hostnames, keys or other private settings.",
      },
    ],
  },

  "json-to-ts": {
    about: [
      "When you start using an API from TypeScript, writing interfaces for its responses by hand is slow and easy to get wrong. Paste a sample response here and the tool writes the interfaces for you, one per nested object, named after the keys they sit under.",
      "It looks at every value, not just the first. If the items in an array have different keys, they are merged into one interface, and a key missing from some items is marked optional with a question mark. Arrays that mix kinds of values get a union type such as (number | string)[].",
      "The result describes only the sample you gave it. Treat it as a starting point and tighten it by hand where you know more than the sample shows.",
    ],
    steps: [
      "Paste a JSON sample, ideally a real response with as many fields filled in as possible.",
      "Change the root name if you want something more specific than Root.",
      "Press Make types.",
      "Copy the interfaces into your code and adjust the names to taste.",
    ],
    example: {
      caption: "Array items with different keys become one interface with an optional field",
      input: '{"items":[{"a":1},{"a":2,"b":"x"}]}',
      output: "export interface Root {\n  items: Item[];\n}\n\nexport interface Item {\n  a: number;\n  b?: string;\n}",
    },
    faqs: [
      {
        q: "How are the interfaces named?",
        a: "After the key that holds the object, in Pascal case. Array keys are made singular, so items gives Item and categories gives Category. If two objects would get the same name, the second gets a number, such as User2.",
      },
      {
        q: "What type does null get?",
        a: "The type null. If the same field is null in one item and a string in another, it becomes string | null. A field that is null in your whole sample tells the tool nothing more, so replace it with the real type by hand.",
      },
      {
        q: "What about an empty array?",
        a: "It becomes unknown[], because there is nothing in it to learn from.",
      },
      {
        q: "Does it handle keys with dashes or spaces?",
        a: "Yes. Keys that are not valid identifiers are written in quotes, such as \"first-name\": string.",
      },
    ],
  },

  "qr-code": {
    about: [
      "A QR code stores text in a square pattern that phone cameras can read. Most hold a link, but they can carry any text: a Wi-Fi setup string, a phone number, a short note. This tool draws the code as you type and lets you download it as a PNG for documents and slides or as an SVG that stays sharp at any size, which is best for print.",
      "Error correction adds spare data so a code still scans when part of it is dirty, creased or covered by a logo. Higher levels survive more damage but need more squares, so the code gets denser. Medium suits most uses on screen and paper.",
    ],
    steps: [
      "Type or paste the link or text.",
      "Pick an error correction level if you need more than the default.",
      "Check the preview with your phone's camera.",
      "Press Download PNG or Download SVG.",
    ],
    faqs: [
      {
        q: "How much text can a QR code hold?",
        a: "Up to about 2,900 characters of plain text at the Low level, and less at higher levels. Long text makes a dense code that is hard to scan, so keep it short. If the text is too long, the cat says so.",
      },
      {
        q: "Do these codes expire?",
        a: "No. The text is stored in the pattern itself and nothing points back to this site, so the code works for as long as whatever it contains does.",
      },
      {
        q: "How big is the PNG?",
        a: "1024 pixels square, with a quiet white border around the code, which scanners need. The SVG has no fixed size.",
      },
      {
        q: "Can I add a logo in the middle?",
        a: "Not in this tool. If you add one in an image editor, choose the High level first and keep the logo small, then test that it still scans.",
      },
    ],
  },

  cron: {
    about: [
      "Cron expressions schedule jobs on Unix systems, in Kubernetes CronJobs, GitHub Actions and many hosted schedulers. Five short fields are easy to misread, so this tool describes the schedule in plain English and lists the next ten times it will run.",
      "The fields are minute, hour, day of the month, month and day of the week. Each accepts a star for every value, a number, a range such as 1-5, a list such as 1,15, or a step such as */10. Months and weekdays can also be written as three-letter names like JAN or MON, and Sunday can be 0 or 7. Shortcuts such as @daily and @hourly work too.",
      "When both the day of the month and the day of the week are set, standard cron runs the job on days that match either one, not both. The run list follows that rule, which surprises many people.",
    ],
    steps: [
      "Type a cron expression, or pick one of the examples.",
      "Read the description under the cat.",
      "Check the next runs. They are shown in your computer's time zone; tick Show in UTC if your server runs on UTC.",
    ],
    example: {
      caption: "Every weekday morning",
      input: "0 9 * * 1-5",
      output: "At 09:00, Monday through Friday",
    },
    faqs: [
      {
        q: "Does it support a seconds field or Quartz syntax?",
        a: "No. It reads the standard five fields. Six- or seven-field Quartz expressions and the special characters ?, L, W and # are reported as errors.",
      },
      {
        q: "Why does 0 0 13 * 5 run on more than Friday the 13th?",
        a: "Because cron joins the two day fields with or. That expression runs on the 13th of every month and on every Friday.",
      },
      {
        q: "What time zone will my job use?",
        a: "Whatever the system running it uses. Plain cron uses the server's local time, and GitHub Actions uses UTC. The UTC option here helps you check the second case.",
      },
      {
        q: "What if the date never comes, such as 30 February?",
        a: "The tool searches eight years ahead. If nothing matches in that time, the cat tells you the schedule never runs.",
      },
    ],
  },

  "sql-formatter": {
    about: [
      "A query copied from a log or written in a hurry often ends up on one long line. The SQL formatter breaks it up so each clause starts on its own line and the columns, joins and conditions are indented under it, which makes it far easier to review or debug.",
      "Dialects differ in their keywords, quoting and operators, so pick the one your database uses: standard SQL, PostgreSQL, MySQL, SQLite, SQL Server, Oracle, BigQuery or Snowflake. You can also choose whether keywords come out in upper case, lower case or as you typed them.",
    ],
    steps: [
      "Paste one or more SQL statements.",
      "Choose the dialect and the keyword case.",
      "Press Format, then Copy result.",
    ],
    example: {
      caption: "A one-line query, formatted as standard SQL",
      input: "select id,name from users where id=1",
      output: "SELECT\n  id,\n  name\nFROM\n  users\nWHERE\n  id = 1",
    },
    faqs: [
      {
        q: "Does it check that my query is correct?",
        a: "No. It only changes the layout. It reports an error when it cannot make sense of the text at all, such as an unclosed bracket, but it does not know your tables or run anything.",
      },
      {
        q: "Will formatting change what the query does?",
        a: "No. Only spaces, line breaks and the case of keywords change. Names, strings and values are left as they are.",
      },
      {
        q: "Are comments kept?",
        a: "Yes, both -- line comments and /* block comments */ stay in place.",
      },
      {
        q: "Which formatting library does it use?",
        a: "The open source sql-formatter library, with two-space indentation.",
      },
    ],
  },

  markdown: {
    about: [
      "Markdown is the plain-text format behind README files, GitHub issues, documentation sites and many note apps. This tool shows how your Markdown will look as you type, so you can check a README or a long comment before you post it.",
      "It follows GitHub Flavored Markdown, so tables, task lists with checkboxes, strikethrough and fenced code blocks work as they do on GitHub. Copy HTML gives you the rendered HTML for pasting into a page or an email template.",
      "Before anything is shown, the HTML is cleaned with DOMPurify, which removes scripts and other unsafe markup. That keeps the preview safe even when you paste Markdown from somewhere you don't trust.",
    ],
    steps: [
      "Type or paste Markdown into the left box.",
      "Watch the preview on the right update as you go.",
      "Press Copy HTML if you need the HTML itself.",
    ],
    example: {
      caption: "Markdown and the HTML it turns into",
      input: "# Hi\n\nSome **bold** and `code`.",
      output: "<h1>Hi</h1>\n<p>Some <strong>bold</strong> and <code>code</code>.</p>",
    },
    faqs: [
      {
        q: "Will it look exactly like GitHub?",
        a: "The structure will match, but the styling is this site's own. Code blocks are not colour-highlighted, and GitHub extras such as @mentions, issue links and emoji shortcodes are not converted.",
      },
      {
        q: "Can I use raw HTML in my Markdown?",
        a: "Yes, safe HTML such as <details> or <kbd> is kept. Scripts, event handlers and similar are removed.",
      },
      {
        q: "Is the copied HTML cleaned too?",
        a: "Yes. Copy HTML gives the same cleaned HTML that the preview shows.",
      },
      {
        q: "Is my text saved?",
        a: "No. It lives only in this page and is gone when you close or reload it.",
      },
    ],
  },

  "html-entities": {
    about: [
      "Some characters have a special meaning in HTML. A < starts a tag and an & starts an entity, so showing them as text means writing them as entities such as &lt; and &amp;. Encode does that for the five characters that matter: &, <, >, double quotes and single quotes. The result is safe to place inside HTML text or an attribute.",
      "Decode goes the other way. It reads numeric references such as &#169; and &#xA9;, and about fifty common named ones such as &copy;, &nbsp;, &mdash; and &eacute;. A name it does not know is left as it is rather than guessed.",
    ],
    steps: [
      "Paste text or HTML into the left box.",
      "Tick Also encode non-ASCII if the HTML must be pure ASCII, for example in an old email system.",
      "Press Encode or Decode, then Copy result.",
    ],
    example: {
      caption: "A snippet of HTML, encoded",
      input: '<a href="x">Tom & Jerry</a>',
      output: "&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&lt;/a&gt;",
    },
    faqs: [
      {
        q: "Why is the single quote written as &#39; and not &apos;?",
        a: "&apos; was not part of HTML 4, so some older software does not understand it. &#39; works everywhere.",
      },
      {
        q: "What does Also encode non-ASCII do?",
        a: "It turns every character outside plain ASCII into a numeric reference, so é becomes &#xE9; and emoji are written as one reference each. Modern pages served as UTF-8 do not need this.",
      },
      {
        q: "Does decoding twice cause problems?",
        a: "Each press decodes one layer, so &amp;amp; becomes &amp; and a second press gives &. That lets you unpick text that was escaped twice by mistake.",
      },
      {
        q: "Are entity names case-sensitive?",
        a: "Yes, as in HTML. &Eacute; is É, &eacute; is é, and &AMP; is not decoded.",
      },
    ],
  },

  "url-parser": {
    about: [
      "A long URL packs a lot into one line: the scheme, the host, a port, a path, a query string with several parameters and a fragment. The URL parser splits it into those parts and decodes each query parameter, so you can see what a tracking link, OAuth redirect or API request actually carries.",
      "It uses the browser's own URL parser, the same one that decides where a link goes. Percent escapes in the path and parameters are decoded for display, a plus sign in a query value is shown as a space, and a parameter that appears more than once is listed once for each value.",
    ],
    steps: [
      "Paste a full URL, including the scheme such as https://.",
      "Read the parts, then the query parameters below them. Both update as you type.",
      "Press Copy next to any part or value to take it.",
    ],
    example: {
      caption: "A query string, decoded",
      input: "https://x.dev/search?q=caf%C3%A9+au+lait&tag=a&tag=b",
      output: "q = café au lait\ntag = a\ntag = b",
    },
    faqs: [
      {
        q: "Why is the port missing for my URL?",
        a: "Browsers drop a port that is the default for the scheme, such as 443 for https or 80 for http, so it is not shown.",
      },
      {
        q: "Why does it say my URL is not full?",
        a: "Without a scheme, example.com/page is not a URL to the browser but a relative path. Add https:// at the start.",
      },
      {
        q: "Why does an international domain look odd?",
        a: "The browser shows the host in its ASCII form, called punycode, so a domain with accented letters appears as xn-- followed by letters. That is the name DNS actually uses.",
      },
      {
        q: "Is the URL visited?",
        a: "No. It is only read as text. Nothing is fetched from it.",
      },
    ],
  },
};
