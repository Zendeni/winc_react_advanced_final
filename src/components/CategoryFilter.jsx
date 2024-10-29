import { Radio, RadioGroup, Stack, Text, Center } from "@chakra-ui/react";

const CategoryFilter = ({ categories, value, onChange }) => (
  <RadioGroup onChange={onChange} value={value.toString()}>
    <Center>
      <Text fontWeight={"semibold"} fontSize={"lg"} pb={1}>
        Filter type of event:
      </Text>
    </Center>
    <Stack direction="row" mb={5}>
      <Radio value="0">All</Radio>
      {categories.map((category) => (
        <Radio key={category.id} value={category.id.toString()} pl={6}>
          <Text textTransform={"capitalize"}>{category.name}</Text>
        </Radio>
      ))}
    </Stack>
  </RadioGroup>
);

export default CategoryFilter;
